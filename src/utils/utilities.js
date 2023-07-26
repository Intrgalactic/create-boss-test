
export function validateForm(data, setErr) {
    const emailRegEx = new RegExp(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/);
    var errKey = "";
    var secErrKey = "";
    for (const [key, value] of Object.entries(data)) {
        if (value === "") {
            for (let i = 0; i < key.length; i++) {
                if (key[i] === key[i].toUpperCase()) {
                    errKey = key.substring(0, i);
                    secErrKey = key.substring(i);
                    secErrKey = secErrKey.toLowerCase();
                    break;
                }
            }
            if (errKey !== "") {
                setErr(`Empty ${errKey} ${secErrKey}`);
            }
            else {
                setErr(`Empty ${key}`);
            }
            return false;
        }
    }
    if (!emailRegEx.test(data.email) && data.email) {
        setErr('Wrong E-mail Format');
        return false;
    }
    if (data.password || data.secondPassword) {
        data.password ? validatePassword(data.password,setErr) : validateForm(data.secondPassword,setErr);
    }
    setErr(false);
    return true;
}
export function validatePassword(data, setErr) {
    const passwordRegEx = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/);
    const numberRegEx = new RegExp(/(?=.*?[0-9])/);
    const specialCharRegEx = new RegExp(/(?=.*?[#?!@$%^&*-])/);
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
        default: setErr("An error occured, please try again.")
    }
}