import Vue from 'vue';
import VueRouter from 'vue-router'
import DemandesList from '../views/DemandesList'
import MyDemandesList from '../views/MyDemandesList'
import DemandesAime from '../views/DemandesAime'
import DemandesVues from '../views/DemandesVues'
import test from '../views/test'
import detail from "../views/detail";



Vue.use(VueRouter);

const routes = [

    {
        path: '/',
        name: 'accueil',
        component: DemandesList
    },
    {
        path: '/test',
        name: 'test',
        component: test
    },
    {
        path: '/demande/my_demandes/:id',
        name: 'my-demandes',
        props: true,
        component: MyDemandesList
    },
    {
        path: '/demande/DemandesVues',
        name: 'demandes-vues',
        component: DemandesVues
    },
    {
        path: '/demande/DemandesAime',
        name: 'demandes-aime',
        component: DemandesAime
    },

    {
        path: '/demande/:id',
        name: 'demande',
        props: true,
        component: detail
    },
    
];

const router = new VueRouter({
    mode: 'history',
    base: '',
    routes
});

export default router;
