import mongoose from "mongoose";

const seekerSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		riskTypes: {
			type: Array,
			required: true,
			default: [],
		},
		typeNeed: {
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
	},
	{ timestamps: true }
);

const Seeker = mongoose.model("Seeker", seekerSchema);
export default Seeker;
