import type { ReactElement } from "react";
import "./spinner.css";

export const Spinner = (): ReactElement => (
    <div className="spinner-wrapper">
        <div className="spinner" />
    </div>
);
