.PHONY: demo watch serve readme copyimages

copyimages:
	cp literallycanvas/img/* demo/img/
	cp lib/img/* demo/img/

readme: serve

demo:
	webpack --progress --colors

watch:
	webpack --watch

serve: copyimages
	webpack-dev-server --progress --colors --watch --port 8080