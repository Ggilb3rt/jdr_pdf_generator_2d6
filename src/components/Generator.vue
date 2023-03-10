<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	import * as pdfMake from "pdfmake/build/pdfmake";
	import * as pdfFonts from 'pdfmake/build/vfs_fonts';
	import simpleObj from './simpleObj'

	(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

	const globalStyle = {
		black_bg: '#202020',
		white: '#ffffff'
	}


	function generateCompletObj() {
		return {
			table: {
				heights: ['*', 20, 20, '*', 20, '*', 50],
				widths: [150, '*', '*', '*', '*', '*', '*', '*', '*', 50, 20],
				body: [
					[{text:'', rowSpan: 7},{text: 'Qualité', colSpan: 6, style: 'blackandwhite'},'','','','','',{text: 'Fiche Objet', colSpan: 4, style: 'blackandwhite'},'','',''],
					['',{text: '', colSpan: 6},'','','','','',{text: 'Nom', style: 'blackandwhite'},{text:'', colSpan: 3},'',''],
					['',{text: 'DGT', style: 'blackandwhite'},'',{text: 'PDE', style: 'blackandwhite'},'',{text: 'PR', style: 'blackandwhite'},'',{text: 'Type', style: 'blackandwhite'},{text:'', colSpan: 3},'',''],
					['',{text: 'Prix', colSpan: 2, style: 'blackandwhite'}, '',{text: 'Poids', colSpan: 2, style: 'blackandwhite'},'',{text: 'Type de minerai', colSpan: 3, style: 'blackandwhite'},'', '',{text: 'Quantité de minerai', colSpan: 3, style: 'blackandwhite'}, '',''],
					['',{text: '', colSpan: 2}, '', {text: '', colSpan: 2}, '', {text: '', colSpan: 3}, '', '', {text: '', colSpan: 3}, '',],
					['', {text: 'Bonus', colSpan: 5, style: 'blackandwhite'}, '', '', '', '', {text: 'Malus', colSpan: 5, style: 'blackandwhite'}, '', '', '', ''],
					['', {text: '', colSpan: 4}, '', '', '', '+', {text: '', colSpan: 4}, '', '', '', '-'],
					
					
					// ['',{text: 'Prix', colSpan: 3, style: 'blackandwhite'},'','',{text: 'Poids', colSpan: 3, style: 'blackandwhite'},'','',{text: 'Bonus', style: 'blackandwhite'},{text: '', colSpan: 2, border: [true, true, true, false]},'',],
					// ['',{text: '', colSpan: 3},'','',{text: '', colSpan: 3},'','',{text: '', colSpan: 2, border: [true, false, true, true]},'','+',],
					// ['',{text: 'Type de minerai', colSpan: 3, style: 'blackandwhite'},'','',{text: 'Quantité de minerai', colSpan: 3, style: 'blackandwhite'},'','',{text: 'Malus', style: 'blackandwhite'},{text: '', colSpan: 2, border: [true, true, true, false]},'',],
					// ['',{text: '', colSpan: 3},'','',{text: '', colSpan: 3},'','',{text: '', colSpan: 2, border: [true, false, true, true]},'','-',],
					
				]
			}
		}
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
		let toPush = () => { return {} }
		getDatas.forEach(data => {
			if (data.type == 'Simple')
				toPush = () => { return simpleObj.generateSimpleObject() }
			else if (data.type == 'Complet')
				toPush = () => { return generateCompletObj() }
			leContent.push({text: leTitle(data.type), style: 'header'})
			for (let i = 0; i < data.qt; i++) {
				leContent.push(toPush())
				if (data.qt > 1)
					leContent.push(lineSeparator(i+1, 3))
			}
		})

		const docDefinition = ref({
			pageMargins: [ 10, 10, 10, 10 ],
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
				blackandwhite: {
					fillColor: globalStyle.black_bg,
					color: globalStyle.white,
					alignment: 'center',
				}
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

	// const qt = ref<number>(3);
	// const selected = ref<string>("Complet");
	// const typeObjList = ref<Array<{text: string, value: string}>>([
	// 	{ text: 'Simple', value: 'Simple' },
	// 	{ text: 'Complet', value: 'Complet' },
	// 	{ text: 'Véhicule', value: 'Véhicule' },
	// ])



	const selectsList = ref([
		generateTypeObjListSelect(),
	])
	function generateTypeObjListSelect() {
		return ref({
			selected: "Complet",
			qt: 3,
			types: [
				{ text: 'Objet simple', value: 'Simple' },
				{ text: 'Objet complet', value: 'Complet' },
				{ text: 'Véhicule', value: 'Véhicule' },
			]
		})
	}
	function addObjToList() {selectsList.value.push(generateTypeObjListSelect())}
	function removeObj(el: any) {if (selectsList.value.length > 1) selectsList.value.splice(selectsList.value.indexOf(el), 1)}
</script>

<template>
	<div>
		<h1>Génération de fiches objets</h1>
		<p>Le pdf contiendra : </p>
		<div v-for="list in selectsList" :key="list.value.qt" class="obj_select_wrapper">
			<input type="number" min="1" v-model=list.value.qt>
			<select v-model="list.value.selected">
				<option v-for="typeObj in list.value.types" :key="typeObj.value" :value="typeObj.value">
					{{ typeObj.text }}
				</option>
			</select>
			<div>
				<button v-if="selectsList.length > 1" @click="removeObj(list)" class="btn btn_remove">
						X
				</button>
			</div>
		</div>
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

	.obj_select_wrapper {
		display: flex;
	}
	.obj_select_wrapper > div {
		overflow: hidden;
	}
	.obj_select_wrapper:hover .btn_remove {
		transform: translateX(0);
	}
	
	.btn_remove {
		width: 25px;
		transition: all 0.2s ease-in-out;
		transform: translateX(-25px);
		background: #FF4742;
		border: 1px solid #FF4742;
		box-shadow: rgba(0, 0, 0, 0.1) 1px 2px 4px;
		box-sizing: border-box;
		color: #FFFFFF;
		cursor: pointer;
		display: inline-block;
		outline: 0;
		text-align: center;
		user-select: none;
		-webkit-user-select: none;
		touch-action: manipulation;
		vertical-align: middle;
	}

	.btn_remove:hover,
	.btn_remove:active {
	background-color: initial;
	background-position: 0 0;
	color: #FF4742;
	}

	.btn_remove:active {
	opacity: .5;
	}

</style>