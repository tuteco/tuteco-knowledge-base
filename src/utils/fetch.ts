enum DataType {
    structure = "structure",
    data = "data"
}

type FetchJsonDataType = {
    type: DataType
    name: string
}

async function fetchJsonData({type, name}: FetchJsonDataType) {
    const response = await fetch(`data/${type}/${name}.json`);
    const data = await response.json();

    if (!response.ok) {
        if (response.status === 404) {
            console.warn(`Datei nicht gefunden: ${name}.json`);
            return;
        } else {
            throw new Error("Etwas ist schief gelaufen. Die Daten konnten nicht geladen werden.");
        }
    }
    return data;
}

export async function getTopicAreas() {
    return await fetchJsonData({type: DataType.structure, name: "topic"});
}

export async function getInformationCategories() {
    return await fetchJsonData({type: DataType.structure, name: "category"});
}

type GetCategoryDataType = {
    category: string
}

export async function getCategoryData({category}: GetCategoryDataType) {
    return await fetchJsonData({type: DataType.data, name: category});
}