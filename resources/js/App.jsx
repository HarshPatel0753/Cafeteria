import "./bootstrap";

import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import Layout from "./components/Layout";
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob("./pages/**/*.jsx", { eager: true });
        let page = pages[`./pages/${name}.jsx`];

        page.default.layout =
            page.default.layout || ((page) => <Layout children={page} />);

        return page;
    },
    setup({ el, App, props }) {
        const value = {
            appendTo: "self",
        };
        createRoot(el).render(
            <PrimeReactProvider value={value}>
                <App {...props} />
            </PrimeReactProvider>
        );
    },
});
