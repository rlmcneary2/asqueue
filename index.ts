

export default async (): Promise<void> => {

    const d = await getTime();
    print("message", 1, d.toLocaleDateString());

};

function print(...args): void {
    console.log(`args: ${args}`);
}

async function getTime(): Promise<Date> {
    return new Promise<Date>(resolve => {
        setTimeout(() => {
            resolve(new Date());
        }, 1000);
    });
}
