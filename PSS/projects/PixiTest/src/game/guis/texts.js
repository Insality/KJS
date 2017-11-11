Texts = {
	_getText: function(text, size, color, position, strokeColor, strokeThickness, font) {
		strokeColor = typeof strokeColor !== "undefined" ? strokeColor : "#FFFFFF";
		strokeThickness = typeof strokeThickness !== "undefined" ? strokeThickness : 0;
		if (text === undefined) text = "";
		if (font === undefined) font = "tahoma";

		var pixiText = new PIXI.Text(text.toString(), {fontWeight: "bold", fontSize: size, fontFamily: font, fill:color, stroke: strokeColor, strokeThickness: strokeThickness, lineJoin: "round"});
		pixiText.position = position;
		pixiText.anchor.set(0.5);
		pixiText.scale.set(0.5);
		return pixiText;
	},

	_getTextShadowed: function(text, size, color, position, shadowColor, shadowOffset, font) {
		if (text === undefined) text = "";
		if (font === undefined) font = "tahoma";
		var pixiText = new PIXI.Text(text.toString(), {fontWeight: "bold", fontSize: size, fontFamily: font, fill:color, dropShadow: true, dropShadowAngle: Math.PI/2, dropShadowColor: shadowColor, dropShadowDistance: shadowOffset, lineJoin: "round"});
		pixiText.position = position;
		pixiText.anchor.set(0.5);
		pixiText.scale.set(0.5);
		return pixiText;
	},

	getText: function(text, pos) {
		return this._getText(text, 80, "#FFFFFF", pos, "#000000", 6);
	},
}