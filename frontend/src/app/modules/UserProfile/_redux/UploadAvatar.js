import axios from "axios";
import { BACKEND_ORIGIN } from "../../../../config"

// https://masteringjs.io/tutorials/axios/put
// https://github.com/axios/axios/tree/master/examples/upload
export function uploadAvatar(form){	
	// {'id':user.id,'avatar':data}
	let url = BACKEND_ORIGIN+`api/v1/users/${form.id}/`;
	return axios.put(url,form.avatar);
};