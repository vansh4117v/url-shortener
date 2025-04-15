import React, { forwardRef } from "react";

const Input = ({ label = null,className="", type = "text",...props },ref) => {
	return (
		<div className="w-full">
			{label && (
				<label className="inline-block mb-1 pl-1">
					{label}
				</label>
			)}
			<input
                ref={ref}
				type={type}
                className={`bg-inherit border-2 border-white w-4/5 lg:w-full rounded-md outline-none p-2 ${className}`}
                {...props}
			/>
		</div>
	);
};

export default forwardRef(Input);
