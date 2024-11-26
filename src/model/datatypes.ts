export type PropertyValueType = {
    title: string,
    content: string | PropertyType[]
}

export type PropertyType = {
    type: string,
    key: string,
    value: string[] | PropertyValueType[],
}

export type LinkType = {
    id: string,
    name: string,
    category: string,
    direction: string,
    type?: string,
}

type MetaType = {
    dataSourceName: string,
    dataSourceType: string,
    label?: string,
    tags?: string[],
}

export type EntityType = {
    id: string,
    name: string,
    category: string,
    properties: PropertyType[],
    notes?: PropertyType,
    links?: LinkType[],
    meta?: MetaType
}

export type TopicAreaType = {
    id: string,
    description: string,
    icon: string
}

export type InformationCategoryType = {
    id: string,
    description: string,
    icon: string
}

export type NavigationType = {
    topicArea?: TopicAreaType,
    informationCategory?: InformationCategoryType,
    entityId?: string
}