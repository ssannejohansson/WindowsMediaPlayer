import type { ReactElement } from "react";
import "./error-message.css";

interface Props {
    message?: string;
    onRetry?: () => void;
}

export const ErrorMessage = ({ message = "Something went wrong.", onRetry }: Props): ReactElement => (
    <div className="error-message">
        <div className="error-message-title">Error</div>
        <div className="error-message-body">
            <span className="error-message-icon">⚠</span>
            <div className="error-message-content">
                <div className="error-message-text">{message}</div>
                {onRetry && (
                    <button type="button" className="error-message-retry" onClick={onRetry}>
                        Retry
                    </button>
                )}
            </div>
        </div>
    </div>
);
