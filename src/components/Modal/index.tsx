import { createPortal } from "react-dom";
import useModal from "../../hooks/useModal";
import "./styles.scss";

interface ModalProps {
    children: React.ReactNode,
    handleClose?: Function
}
 
const Modal: React.FC<ModalProps> = ({
    children,
    handleClose = () => {}
}): JSX.Element => {
    const portal = useModal("modal-root");

    return createPortal(
        (
            <div className = "modal-wrapper">
                <div className="overlay" onClick={() => handleClose()}></div>
                <div className="content">
                    { children }
                </div>
            </div>
        ),
        portal
    );
}
 
export default Modal;