import mongoose from "mongoose";

const providerSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		riskTypes: {
			type: [String],
			required: true,
		},
		typeProvide: {
			type: [String],
			required: true,
		},
		ages: {
			type: [Number],
			required: true,
		},
		people: {
			type: [String],
			required: true,
		},
		appTitle: {
			type: String,
			required: true,
		},
		confirmPer: {
			type: Number,
			required: true,
		},
	},
	{ timestamps: true }
);

const Provider = mongoose.model("Provider", providerSchema);
export default Provider;
