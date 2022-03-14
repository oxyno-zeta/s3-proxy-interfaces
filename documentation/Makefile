.DEFAULT_GOAL := code/docs

#############
#   Build   #
#############

.PHONY: code/docs
code/docs: setup/docs
	docker run --rm -it --user 1000:1000 -v ${PWD}:/docs -p 8000:8000 mkdocs serve -a 0.0.0.0:8000

.PHONY: code/build/docs
code/build/docs: setup/docs
	docker run --rm -it --user 1000:1000 -v ${PWD}:/docs -p 8000:8000 mkdocs build

#############
#   Setup   #
#############

.PHONY: setup/docs
setup/docs:
	docker build -t mkdocs -f Dockerfile.docs .
