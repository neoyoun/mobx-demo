import React from 'react'

function PopupModal({text}) {
	return (
		<div className="popup-modal">
			<div className="modal-body text-warning">
			{text}
			</div>
		</div>
		)
}
export default PopupModal