async function whoAmI() {
    const res = await fetch("/whoami");
    if (!res.ok) {
        return null;
    } 

    return await res.json();
}