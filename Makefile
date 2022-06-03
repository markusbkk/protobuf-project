# https://github.com/aperturerobotics/protobuf-project

PROTOWRAP=hack/bin/protowrap
PROTOC_GEN_GO=hack/bin/protoc-gen-go
PROTOC_GEN_GO_GRPC=hack/bin/protoc-gen-go-grpc
PROTOC_GEN_VTPROTOBUF=hack/bin/protoc-gen-go-vtprotobuf
GOIMPORTS=hack/bin/goimports
GOLANGCI_LINT=hack/bin/golangci-lint
GO_MOD_OUTDATED=hack/bin/go-mod-outdated
export GO111MODULE=on
GOLIST=go list -f "{{ .Dir }}" -m

all:

vendor:
	go mod vendor

$(PROTOC_GEN_GO):
	cd ./hack; \
	go build -v \
		-o ./bin/protoc-gen-go \
		google.golang.org/protobuf/cmd/protoc-gen-go

$(PROTOC_GEN_GO_GRPC):
	cd ./hack; \
	go build -v \
		-o ./bin/protoc-gen-go-grpc \
		google.golang.org/grpc/cmd/protoc-gen-go-grpc

$(PROTOC_GEN_VTPROTOBUF):
	cd ./hack; \
	go build -v \
		-o ./bin/protoc-gen-go-vtprotobuf \
		github.com/planetscale/vtprotobuf/cmd/protoc-gen-go-vtproto

$(GOIMPORTS):
	cd ./hack; \
	go build -v \
		-o ./bin/goimports \
		golang.org/x/tools/cmd/goimports

$(PROTOWRAP):
	cd ./hack; \
	go build -v \
		-o ./bin/protowrap \
		github.com/square/goprotowrap/cmd/protowrap

$(GOLANGCI_LINT):
	cd ./hack; \
	go build -v \
		-o ./bin/golangci-lint \
		github.com/golangci/golangci-lint/cmd/golangci-lint

$(GO_MOD_OUTDATED):
	cd ./hack; \
	go build -v \
		-o ./bin/go-mod-outdated \
		github.com/psampaz/go-mod-outdated

.PHONY: gengo
gengo: $(GOIMPORTS) $(PROTOWRAP) $(PROTOC_GEN_GO) $(PROTOC_GEN_GO_GRPC) $(PROTOC_GEN_VTPROTOBUF)
	go mod vendor
	shopt -s globstar; \
	set -eo pipefail; \
	export PROJECT=$$(go list -m); \
	export PATH=$$(pwd)/hack/bin:$${PATH}; \
	mkdir -p $$(pwd)/vendor/$$(dirname $${PROJECT}); \
	rm $$(pwd)/vendor/$${PROJECT} || true; \
	ln -s $$(pwd) $$(pwd)/vendor/$${PROJECT} ; \
	$(PROTOWRAP) \
		-I $$(pwd)/vendor \
		--go_out=$$(pwd)/vendor \
		--go-grpc_out=$$(pwd)/vendor \
		--go-vtprotobuf_out=$$(pwd)/vendor \
		--proto_path $$(pwd)/vendor \
		--print_structure \
		--only_specified_files \
		$$(\
			git \
				ls-files "*.proto" |\
				xargs printf -- \
				"$$(pwd)/vendor/$${PROJECT}/%s "); \
	rm $$(pwd)/vendor/$${PROJECT} || true
	$(GOIMPORTS) -w ./

.PHONY: genproto
genproto: gengo

.PHONY: gen
gen: genproto

outdated: $(GO_MOD_OUTDATED)
	go list -mod=mod -u -m -json all | $(GO_MOD_OUTDATED) -update -direct

list: $(GO_MOD_OUTDATED)
	go list -mod=mod -u -m -json all | $(GO_MOD_OUTDATED)

lint: $(GOLANGCI_LINT)
	$(GOLANGCI_LINT) run

fix: $(GOLANGCI_LINT)
	$(GOLANGCI_LINT) run --fix

test:
	go test -v ./...
