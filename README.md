# ¿Que es ésto?
Este proyecto es una utilidad para generar documentos html con metadata adicional.
También lo he utilizado para experimentar con el uso de `symlinks` (Enlaces Simbólicos) para poder ejecutar el programa como un `cli` utilizando las capacidades de Node.js.

# Instalación

## 1. Agregar una referencia al archivo binario

`package.json`
```json
{
	"name":"needle-gen",
	"version":"1.0.0",
	"scripts": {
		"start": "node ./src/needleIndexGen.js",
		//...scripts...
	},
	"dependencies": {
		//... dependencias...
	},
	//añade una referencia al binario
	"bin": {
		"egen": "./src/needleIndexGen.js"
	}
}
```
- Nótese que aquí `egen` sera el nombre con el que el paquete se agregara en `node_modules`, y este debe apuntar exactamente al punto de entrada de tu aplicación.

## 2. Crea un Enlace Simbólico al proyecto con NPM

```shell
npm ln
```
o
```shell
npm link
```
- Este comando va a generar un enlace simbólico al proyecto en `node_modules` a nivel global.
### Verificando la creación correcta
Para verificar puedes chequear utilizando el comando:
```shell
npm list -g
```
```md
C:\Users\yourUser\AppData\Roaming\npm
├── canvas-sketch-cli@1.11.20
├── needle-gen@1.0.0 -> .\..\..\..\Desktop\Generators
├── npx@10.2.2
└── typescript@4.8.2
```
- En este ejemplo puedes ver que el proyecto se añade como `needle-gen@1.0.0 -> .\..\..\..\Desktop\Generators`, como puedes ver se utilizan los campos `name` y `version`
- Para ejecutarlo siempre utilizamos el nombre asignado en `bin`.

## 3. Crea un enlace simbólico a tu paquete
Usando el nuevo paquete como objetivo, en cualquier proyecto:
```shell
npm ln needle-gen
# Alternativa
npm link needle-gen
```

## 4. Profit
Ahora puedes ejecutar tu aplicación como si de un cli se tratara:
```shell
egen
```
