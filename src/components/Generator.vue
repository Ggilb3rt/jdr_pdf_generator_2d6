<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	import * as pdfMake from "pdfmake/build/pdfmake";
	import * as pdfFonts from 'pdfmake/build/vfs_fonts';

	(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;


	const globalStyle = {
		black_bg: '#202020',
		white: '#ffffff'
	}

	/*
		Creer la structure pour un objet simple
	*/
	function simpleObj(): Array<any> {
		function simple(){
			return {
					table: {
						heights: ['auto', 100],
						widths: [150, '*', '*'],
						body: [
							[
								{rowSpan: 2, text: ''},
								{text: `Nom: ______________________\n\nType: ______________________\n\n`, border: [true, false, false, false]},
								{
									border: [false, false, false, false],
									table: {
										widths: ['*', 12, '*', 12, '*', 12],
										body: [
											[{text: 'DGT', color: globalStyle.white, fillColor: globalStyle.black_bg}, '',
											{text: 'PDE', color: globalStyle.white, fillColor: globalStyle.black_bg}, '',
											{text: 'PE', color: globalStyle.white, fillColor: globalStyle.black_bg}, '']
										]
									}
								},
							],
							[
								'',
								{
									border: [true, false, false, false],
									table: {
										heights: ['auto', 80],
										widths: [100, 'auto', 25],
										body: [
											[{text: 'Bonus', colSpan: 3, color: globalStyle.white, fillColor: globalStyle.black_bg}, {}, {}],
											[{text: ''}, {text: '\n\n+', alignment: 'center'}, {text: ''}]
										]
									}
								},
								{
									border: [false, false, false, false],
									table: {
										heights: ['auto', 80],
										widths: [100, 'auto', 25],
										body: [
											[{text: 'Malus', colSpan: 3, color: globalStyle.white, fillColor: globalStyle.black_bg}, {}, {}],
											[{text: ''}, {text: '\n\n-', alignment: 'center'}, {text: ''}]
										]
									}
								},
							]
						]
					}
				}
			
		}
		const simpleQualite = function(){
			return {
				table: {
					widths: ['*', 12, '*', 12, '*', 12, '*', 12, '*', 12, '*', 12],
					body: [
						[{text: 'Caille', color: globalStyle.white, fillColor: globalStyle.black_bg}, '',
						{text: 'Mauvais', color: globalStyle.white, fillColor: globalStyle.black_bg}, '',
						{text: 'Basique', color: globalStyle.white, fillColor: globalStyle.black_bg}, '',
						{text: 'Excellent', color: globalStyle.white, fillColor: globalStyle.black_bg}, '',
						{text: 'Parlant', color: globalStyle.white, fillColor: globalStyle.black_bg}, '',
						{text: 'Magique', color: globalStyle.white, fillColor: globalStyle.black_bg}, ''],
					],
				},
				margin: [0, 5, 0, 0],
			}
		}
		function simpleContentComplet() {
			return [
				simple(),
				simpleQualite(),
			]
		}
		return simpleContentComplet()
	}




	/*
			Construit le pdf en fonction (du type et) du nombre d'objets choisi
			devrait être extrait de la fonction simpleObj()
		*/
	function lineSeparator(nb: number, sepByPage: number) {
		return {
			canvas: [{ type: 'line', x1: -100, y1: 0, x2: 700, y2: 0, lineWidth: 1, color: 'grey' }],
			margin: [0, 20, 0, 20],
			pageBreak: (nb % sepByPage == 0 && nb >= sepByPage) ? 'after' : 'none',
		}
	}

	function defineDoc(getDatas: Array<{type: string; qt: number}>) {
		let leContent: Array<any> = []
		getDatas.forEach(data => {
			leContent.push({text: leTitle(data.type), style: 'header'})
			for (let i = 0; i < data.qt; i++) {
				leContent.push(simpleObj())
				if (data.qt > 1)
					leContent.push(lineSeparator(i+1, 3))
			}
		})

		const docDefinition = ref({
			info: {
				title: leTitle(getDatas[0].type),
			},
			styles: {
				header: {
					fontSize: 18,
					bold: true,
					margin: [0, 0, 0, 15]
				},
				subheader: {
					fontSize: 16,
					bold: true,
					margin: [0, 10, 0, 5]
				},
			},
			content: leContent
		})
		return docDefinition
	}

	function leTitle(selected: string): string {
		return `Fiche ${selected == 'Véhicule' ? '' : 'objet'} ${selected}`
	}

	function generate(openOnly: Boolean) {
		// const getDatas: Array<{type: string; qt: number}> = [
		// 	{type: selected.value, qt: qt.value},
		// 	// {type: "Complet", qt: qt.value},
		// ]
		const getDatas: Array<{type: string; qt: number}> = selectsList.value.map(select => {
			return {type: select.value.selected, qt: select.value.qt}
		})
		const docDefinition = defineDoc(getDatas)
		const pdf = pdfMake.createPdf(docDefinition.value)
		if (openOnly)
			pdf.open()
		else
			pdf.download(leTitle('objet'))
	}

	const qt = ref<number>(3);
	const selected = ref<string>("Simple");
	const typeObjList = ref<Array<{text: string, value: string}>>([
		{ text: 'Simple', value: 'Simple' },
		{ text: 'Complet', value: 'Complet' },
		{ text: 'Véhicule', value: 'Véhicule' },
	])



	const selectsList = ref([
		generateTypeObjListSelect(),
	])
	function generateTypeObjListSelect() {
		return ref({
			selected: "Simple",
			qt: 3,
			types: [
				{ text: 'Objet simple', value: 'Simple' },
				{ text: 'Objet complet', value: 'Complet' },
				{ text: 'Véhicule', value: 'Véhicule' },
			]
		})
	}
	function addObjToList() {selectsList.value.push(generateTypeObjListSelect())}
</script>

<template>
	<div>
		<h1>Génération de fiches objets</h1>
		<p>Le pdf contiendra : </p>
		<div v-for="list in selectsList" :key="list.value.qt">
			<input type="number" min="1" v-model=list.value.qt>
			<select v-model="list.value.selected">
				<option v-for="typeObj in list.value.types" :key="typeObj.value" :value="typeObj.value">
					{{ typeObj.text }}
				</option>
			</select>
		</div>
		<!-- <div v-for="list in selectsList" :key="list.value">
			<select v-model="selected">
				<option v-for="typeObj in typeObjList" :key="typeObj.value" :value="typeObj.value">
					{{ typeObj.text }}
				</option>
			</select>
			<input type="number" min="1" v-model=qt>
		</div> -->
		<button @click="addObjToList()">Ajouter un objet</button>
		<div>
			<button @click="generate(true)">Générer</button>
			<button @click="generate(false)">Télécharger</button>
		</div>
	</div>
</template>

<style>
	button {
		cursor: pointer;
	}
</style>