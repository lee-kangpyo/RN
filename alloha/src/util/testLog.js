import axios from "axios"
import { URL } from "@env";

export const testLog = async (log) => {
    await axios.get(URL+"/api/v1/testLog", {params:{log:log}})
}

