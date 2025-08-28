// Valida que un email tenga formato correcto
export function isValidEmail(email) {
	return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}

// Valida que un valor sea un número positivo
export function isPositiveNumber(value) {
	return !isNaN(value) && Number(value) > 0;
}

// Valida que un string no esté vacío
export function isNonEmptyString(str) {
	return typeof str === 'string' && str.trim().length > 0;
}

// Valida que un valor esté dentro de un conjunto permitido (enum)
export function isInEnum(value, validValues) {
	return validValues.includes(value);
}
