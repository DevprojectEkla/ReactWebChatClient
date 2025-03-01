import React from "react";
import { ClipLoader } from "react-spinners";

import { THEME_COLOR } from "../config";

export default function Loader ({label, color=THEME_COLOR}) {
return  <div>
                {label}<ClipLoader color={color} />
        </div>
}
