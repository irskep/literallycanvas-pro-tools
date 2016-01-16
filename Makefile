.PHONY: demo watch serve

demo:
	webpack --progress --colors

watch:
	webpack --watch

serve:
	webpack-dev-server --progress --colors --watch --port 8080