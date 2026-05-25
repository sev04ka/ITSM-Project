export interface IMenuLink {
    title: string;
    desc: string;
    path: string;
    icon: string;
    iconColor: string;
    roles: string[];
    exclude?: boolean;
}


export const links: IMenuLink[] = [
    {
        title: "Все заявки",
        desc: "Управление заявками системы",
        path: "/tickets",
        icon: "\u2630",
        iconColor: "purple",
        roles: ["admin", "support"],
    },
    {
        title: "Мои заявки",
        desc: "Просмотр и создание заявок",
        path: "/my-tickets",
        icon: "\u2709",
        iconColor: "blue",
        roles: ["admin", "support", "user"],
    },
    {
        title: "Создать заявку",
        desc: "Новая заявка в службу поддержки",
        path: "/my-tickets/add",
        icon: "\u002B",
        iconColor: "gray",
        roles: ["admin", "support", "user"],
        exclude: true
    },
    {
        title: "Пользователи",
        desc: "Управление пользователями системы",
        path: "/users",
        icon: "\u2605",
        iconColor: "yellow",
        roles: ["super-admin", "admin"],
    },
    {
        title: "Организации",
        desc: "Управление организациями",
        path: "/organizations",
        icon: "\u2302",
        iconColor: "green",
        roles: ["super-admin"],
    },
    {
        title: "Конфигурации",
        desc: "Управление конфигурационными единицами",
        path: "/conf-items",
        icon: "\u2699",
        iconColor: "red",
        roles: ["admin", "support"],
    },
    {
        title: "Мои конфигурации",
        desc: "Просмотр конфигурационных единиц",
        path: "/my-conf-items",
        icon: "\u2699",
        iconColor: "red",
        roles: ["admin", "support", "user"],
    },
];