export function validateEmail(email) {
	if (email === null || typeof email === "undefined" || email.length === 0) return false;
	const re = /@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase()) || !email;
}

export function validatePassword(password) {
	if (password === null || typeof password === "undefined" || password.length === 0) return false;
	return password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,30}$/);
}

export function validateUrl(value) {
	if (typeof value === "undefined" || value === null || value.length === 0) return false;
	return value.match(/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/);
}