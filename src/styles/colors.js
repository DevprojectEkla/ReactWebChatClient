// BLUE GREY from very to Dark to light 0 to 4
export const make_rgba = (rgb,a) => rgb.split(")")[0]+`, ${a})`
export const GBLUE_0 = "rgb(58, 72, 84)"
export const GBLUE_1 = "rgb(63, 74, 86)"
export const GBLUE_1_2 = "rgb(70, 130, 180)"
export const GBLUE_1_3 = "rgb(71, 66, 81)"

export const GBLUE_2 = "rgb(92, 113, 126)"
export const GBLUE_2_1 = "rgb(112, 126, 151)"

export const GBLUE_3 = "rgb(87, 119, 134)"
export const GBLUE_4 = "rgb(122, 165, 183)"
export const GBLUE_5 = "rgb(125, 174, 178)"

const GBLUE_COLLECTION = [GBLUE_0, GBLUE_1, GBLUE_2, GBLUE_3, GBLUE_4]
var TMP_GBLUE_RGBA_COLL = []
for (let i = 0; i < GBLUE_COLLECTION.length; i++){
   TMP_GBLUE_RGBA_COLL.push(make_rgba(GBLUE_COLLECTION[i],".5"))

}
export const GBLUE_RGBA_COLL = TMP_GBLUE_RGBA_COLL
