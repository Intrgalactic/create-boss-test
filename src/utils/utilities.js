import { auth } from "../../firebase.js";
import { signOut } from "firebase/auth";

const numberRegEx = new RegExp(/(?=.*?[0-9])/);
const specialCharRegEx = new RegExp(/(?=.*?[#?!@$%^&*-])/);
export function validateForm(data, setErr) {
    const emailRegEx = new RegExp(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/);
    var errKey = "";
    var secErrKey = "";
    for (const [key, value] of Object.entries(data)) {
        for (let i = 0; i < key.length; i++) {
            if (key[i] === key[i].toUpperCase()) {
                errKey = key.substring(0, i);
                secErrKey = key.substring(i);
                secErrKey = secErrKey.toLowerCase();
                break;
            }
        }
        if (value === "") {
            if (secErrKey !== "") {
                setErr(`Empty ${errKey} ${secErrKey}`);
            }
            else {
                setErr(`Empty ${key}`);
            }
            return false;
        }

        else {
            if (key !== "email" && emailRegEx.test(value)) {
                setErr(`${errKey} ${secErrKey ? secErrKey : ''} cannot be email`);
                return false;
            }
            if (key !== "password" && key !== "secondPassword" && key !== "userName" && key !== "email" && numberRegEx.test(value)) {
                setErr(`${key} ${secErrKey ? (errKey, secErrKey) : ''} cannot contain numbers`);
                return false;
            }
            if (key !== "password" && key !== "secondPassword" && key !== "email" && specialCharRegEx.test(value)) {
                setErr(`${key} ${secErrKey ? (errKey, secErrKey) : ''} cannot contain special characters`);
                return false;
            }
        }
    }
    if (!emailRegEx.test(data.email) && data.email) {
        setErr('Wrong E-mail Format');
        return false;
    }
    if (data.password || data.secondPassword) {
        if (data.secondPassword) {
            if (!validatePassword(data.password, setErr)) {
                return false;
            }
            if (!validatePassword(data.secondPassword, setErr)) {
                return false;
            }
        }
        else if (!validatePassword(data.password, setErr)) {
            return false;
        };
    }
    if ((data.password && data.secondPassword) && data.password != data.secondPassword) {
        setErr("Passwords Are Not The Same");
        return false;
    }
    if (data.isChecked === false) {
        setErr("You Must Agree With Our Terms And Conditions");
        return false;
    }
    setErr(false);
    return true;
}
export function validatePassword(data, setErr) {
    const passwordRegEx = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/);
    const lowLetterRegEx = new RegExp(/(?=.*?[a-z])/);
    const upperLetterRegEx = new RegExp(/(?=.*?[A-Z])/);
    if (!passwordRegEx.test(data)) {
        if (data.length < 8) {
            setErr("Passwords are too short");
            return false;
        }
        if (!numberRegEx.test(data)) {
            setErr("Password must contain atleast one digit");
            return false;
        }
        if (!specialCharRegEx.test(data)) {
            setErr("Password must contain atleast one special character");
            return false;
        }
        if (!lowLetterRegEx.test(data)) {
            setErr("Password must contain atleast one low character");
            return false;
        }
        if (!upperLetterRegEx.test(data)) {
            setErr("Password must contain atleast one uppercase character");
            return false;
        }
    }
    setErr(false);
    return true;
}
export function getFirebaseErr(err, setErr) {
    switch (err) {
        case "Firebase: Error (auth/wrong-password).": setErr("Wrong password");
            break;
        case "Firebase: Error (auth/invalid-email).": setErr("Invalid e-mail");
            break;
        case "Firebase: Password should be at least 6 characters (auth/weak-password).": setErr("The password is too weak (insert atleast 6 characters)");
            break;
        case "Firebase: Error (auth/email-already-in-use).": setErr("The e-mail is already in use");
            break;
        case "Firebase: Error (auth/user-not-found).": setErr("User with that e-mail does not exist");
            break;
        case "Firebase: Error (auth/missing-email).": setErr("Missing e-mail");
            break;
        case "Firebase: Error (auth/invalid-action-code).": setErr("Password is already updated");
            break;
        case "Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests)." : setErr("Something went wrong, try again in the next 2 minutes");
            break;
        default: setErr("An error occured, please try again.")
    }
}

export function logOutUser() {
    signOut(auth);
}

export function validateCallback(funcs, param, callback) {
    for (const func of funcs) {
        callback ? func(param, callback) : func(param);
    }
}

export async function fetchUrl(url) {
    const data = await fetch(url).then(res => res.json()).then(data => {return data});
    return data;
}