.PHONY: demo watch serve readme copyimages lib

copyimages:
	mkdir -p demo/img
	cp literallycanvas/img/* demo/img/
	cp lib/img/* demo/img/

readme: serve

demo:
	webpack --progress --colors

watch:
	webpack --watch

serve: copyimages
	webpack-dev-server --progress --colors --watch --port 8080

lib:
		webpack --progress --colors --config webpack.config-lib.js
		webpack --progress --colors --config webpack.config-lib-standalone.js
