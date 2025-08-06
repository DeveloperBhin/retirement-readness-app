import { useContext, useEffect, useRef } from "react"
import { AppContext } from "../App"
import { MdArrowBack, MdClose } from 'react-icons/md';
import Backdrop from "./Backdrop";
import { BsDash } from "react-icons/bs";
import { AiOutlineDash } from "react-icons/ai";

export default function BottomViewer(props) {

	const appContext = useContext(AppContext);
	const viewerRef = useRef(null);



	const showModal = (viewer) => {
		if (viewer) {
			viewer.classList.remove('hiding');
			viewer.classList.add('visible');
			setTimeout(() => {
				document.body.classList.add('modal-open');
			}, 300) // Lock scrolling on body
		}
	};

	const hideModal = (viewer) => {
		if (viewer) {
			viewer.classList.add('hiding');
			setTimeout(() => {
				viewer.classList.remove('visible');
				viewer.classList.remove('hiding');

				if (!appContext.showSideViewer && !appContext.showViewer) {
					document.body.classList.remove('modal-open'); // Re-enable body scrolling
				}

			}, 300); // Match this with the CSS transition duration
		}
	};

	useEffect(() => {
		const viewer = viewerRef.current;

		if (appContext.showBottomViewer) {
			showModal(viewer);
		} else {
			hideModal(viewer);
		}
	}, [appContext.showBottomViewer]);

	return (
		<>
			<Backdrop
				style={{
					visibility: (appContext.showBottomViewer === true) ? "visible" : "hidden",
					opacity: (appContext.showBottomViewer === true) ? "1" : "0",
					zIndex: "var(--highestIndex)",
				}}
			/>
			<div
				className="BottomViewer mShadow2"
				ref={viewerRef}
			>
				<div className="header text-center">
					<div
						className="container d-flex justify-content-center"
						style={{
							height: "100%",
						}}
					>
						<BsDash
							className="align-self-center text-muted"
							size={60}
							style={{
								flexShrink: "0",
								cursor: "pointer",
							}}
							onClick={appContext.navBack}
						/>
					</div>
				</div>

				<div className="body bg-background">
					{appContext.bottomViewerView}
				</div>
			</div>
		</>
	)
}