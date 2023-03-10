const globalStyle = {
	black_bg: '#202020',
	white: '#ffffff'
}

function generateSimpleObject(): Array<any> {
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
	return [simple(), simpleQualite()]
}

export default { generateSimpleObject }