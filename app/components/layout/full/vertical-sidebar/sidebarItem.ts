export interface menu {
    header?: string;
    title?: string;
    icon?: any;
    to?: string;
    chip?: string;
    chipColor?: string;
    chipVariant?: string;
    chipIcon?: string;
    children?: menu[];
    disabled?: boolean;
    type?: string;
    subCaption?: string;
    value?: string;
}


const sidebarItem: menu[] = [
    {
        title: 'Tareas',
        icon: 'mdi-home',
        value: 'Tarea',
        to: '/tareas',
    },
    {
        title: 'Admin',
        icon: 'mdi-home',
        value: 'home',
        children: [
            {
                title: 'Tarea Tipos',
                icon: 'mdi-view-dashboard',
                value: 'TareaTipo',
                to: '/tareatipos',
            },
            {
                title: 'Tarea Estados',
                value: 'TareaEstado',
                icon: 'mdi-account',
                to: '/tareaestados',
            },
            {
                title: 'Tarea Prioridades',
                value: 'TareaPrioridad',
                icon: 'mdi-account-group',
                to: '/tareaprioridades',
            },
            {
                title: 'Tarea Recordatorios',
                value: 'TareaTiempoRecordatorio',
                icon: 'mdi-account-group',
                to: '/tareatiemporecordatorios',
            },
        ],
    },

];


export default sidebarItem;
