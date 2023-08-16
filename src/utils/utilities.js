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
        case "Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests).": setErr("Something went wrong, try again in the next 2 minutes");
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
    const data = await fetch(url).then(res => res.json()).then(data => { return data });
    return data;
}

export function checkIsLoggedAndFetch(isLogged, auth, setLoadingState, setIsPaying, navigate) {
    if (isLogged === false) {
        navigate('/sign-in');
    }

    else if (auth.currentUser !== null) {
        (async function () {
            const userData = await fetchUrl(`${import.meta.env.VITE_SERVER_FETCH_URL}get-user?email=${auth.currentUser.email}`);
            setLoadingState(false);
            setIsPaying(userData.isPaying);
        }());
    }
}

export async function sendData(fetchUrl, data, type, states, stateSetters) {

    const controller = new AbortController();
    const signal = controller.signal;

    var options = {
        method: "POST",
        body: data,
        signal
    }
    type ? options.headers = { "Content-Type": type } : null;

    try {

        setTimeout(() => {
            controller.abort();
        }, 60000);

        await fetch(`${fetchUrl}`, options).then(async (res) => {
            var rawFileResponse;
            if (res.status === 200) {
                const outputExtension = states.outputExtension.toLowerCase() === "ogg" ? "opus" : states.outputExtension.toLowerCase();
                if (states.file) {
                    const fileName = states.file.name.substring(0, states.file.name.indexOf('.'));
                    if (states.file.name) {
                        rawFileResponse = await fetchFile(fetchUrl, '/get/', fileName, outputExtension, stateSetters);
                    }
                }

                else {
                    rawFileResponse = await fetchFile(fetchUrl, '/get/', "output", outputExtension, stateSetters);
                    console.log(rawFileResponse);
                }

                const fileToDownload = await rawFileResponse.blob();
                setFileAndUnload(stateSetters, fileToDownload);
                states.file ? fetch(`${fetchUrl}/delete/${states.file.name.substring(0, states.file.name.indexOf('.'))}.${outputExtension}`) : fetch(`${fetchUrl}/delete/output.${outputExtension}`)

            }
            else {
                setErrorAndUnload(stateSetters, "Please Try Again");
            }
        })

    }
    catch (err) {
        console.log(err);
        setErrorAndUnload(stateSetters, "Please Try Again");
    }
}

export function setLanguageProperties(setLanguage, setLanguageCode, code, name) {
    setLanguage(name);
    setLanguageCode(code);
}
export function handleTextChange(e, states, stateSetters) {
    if (states.setIsTranslated || states.errorAtDownload) {
        stateSetters.setErrorAtDownload(false);
        stateSetters.setIsTranslated(false);
    }
}

async function fetchFile(fetchUrl, fetchPath, filename, outputExtension, stateSetters) {
    return await fetch(`${fetchUrl}${fetchPath}${filename}.${outputExtension}`).catch(err => {
        stateSetters.setLoadingState(false);
        stateSetters.setErrorAtDownload(err.message);
    });;
}

function setErrorAndUnload(stateSetters, errMsg) {
    stateSetters.setErrorAtDownload(errMsg);
    stateSetters.setLoadingState(false);
}

function setFileAndUnload(stateSetters, fileToDownload) {
    stateSetters.setFilePath(fileToDownload);
    stateSetters.setIsTranslated(true);
    stateSetters.setLoadingState(false);
    stateSetters.setErrorAtDownload(false);
}

export function removeDragEffect(setText,setClassList) {
    console.log(setClassList);
    setClassList ? setClassList(true) : setText("Choose Video");
    
}
export function handleFileInputDrag(event,setText,setClassList) {
    event.stopPropagation();
    event.preventDefault();

    setClassList ? setClassList() : setText("Drop");
}
export function handleFileDrop(event,setFile,setErrorAtDownload,setClassList) {
    event.stopPropagation();
    event.preventDefault();
    const fileList = event.dataTransfer.files;
    if (fileList[0].size > 1048576 * 15) {
        setErrorAtDownload("The File Is Too Big");
    }
    else if (fileList.length > 0) {
        console.log(fileList[0]);
        setFile(fileList[0]);
        setClassList && setClassList(true,"attached-file")
    }
}
export function debounce(func, wait, immediate) {
    var timeout
    return function () {
      var context = this,
        args = arguments
      var later = function () {
        timeout = null
        if (!immediate) func.apply(context, args)
      }
      var callNow = immediate && !timeout
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
      if (callNow) func.apply(context, args)
    }
  }

export function expandList(isToggled,setIsToggled,triggerRef,className,imageRef) {
    if (!isToggled) {
        triggerRef.current.classList.add(className);
        setIsToggled(true);
        imageRef.current.querySelector("img").style.transform = "rotate(180deg)";
    }
    else {
        triggerRef.current.classList.remove(className);
        setIsToggled(false);
        imageRef.current.querySelector("img").style.transform = "rotate(0deg)";
    }
}