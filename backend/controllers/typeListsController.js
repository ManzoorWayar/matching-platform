import asyncHandler from "express-async-handler";
import _ from "lodash";
import User from "../model/userModel.js";
import Provider from "../model/providerModel.js";
import Seeker from "../model/seekerModel.js";

// @desc    Get specific seekers for providers
// @route   GET /api/lists/matchlist
// @access  Private
const matchList = asyncHandler(async (req, res) => {
	const providers = await Provider.find({})
		.populate("user", "firstName email image createdAt")
		.select(
			"-typeProvide -ages -people -appTitle -confirmPer -createdAt -updatedAt"
		);

	const seekers = await Seeker.find({})
		.populate("user", "firstName image")
		.select("-typeProvide -ages -people -typeNeed -createdAt -updatedAt");

	// Get riskTypes of provders & seekers
	const providerRisktypes = providers.map((prov) => prov.riskTypes);
	const seekerRisktypes = seekers.map((seek) => seek.riskTypes);

	let result = [];

	// Iterate through every provider
	for (let provider in providerRisktypes) {
		result.push({ provider: providers[provider] });

		// Iterate through every seekers fro specific provider
		for (let seeker in seekerRisktypes) {
			let providerHelpCount = seekerRisktypes[seeker].length;
			let seekerHelpCount = providerRisktypes[provider].length;

			let percentage;

			// Figur-Out percentage of matched-List
			if (providerHelpCount >= seekerHelpCount) {
				percentage = (seekerHelpCount / providerHelpCount) * 100;
			} else {
				percentage = 100;
			}

			result.push({
				// Intersection of between Providers and Seeker: [Match-List]
				match: _.intersection(
					providerRisktypes[provider],
					seekerRisktypes[seeker]
				),
				seeker: seekers[seeker],
				percentage,
			});
		}
	}

	res.status(200).json(result);
});

// @desc    Save/Create questions
// @route   GET /api/lists
// @access  Private
const typeLists = asyncHandler(async (req, res) => {
	const user = await User.findById(req.userID);
	const provider = await Provider.find({ user: req.userID });
	const seeker = await Seeker.find({ user: req.userID });

	// While account type is provider
	if (user && user.accountType === "provider") {
		if (
			provider.length === 0 ||
			Object.values(provider).some(
				(prov) => prov.user.toString() !== req.userID
			)
		) {
			// destructure the request
			const { ages, people, ...rest } = req.body;

			// build a account
			const accountFields = {
				user: req.userID,
				ages: Array.isArray(ages)
					? ages
					: ages.split(",").map((age) => " " + age.trim()),
				people: Array.isArray(people)
					? people
					: people.split(",").map((person) => " " + person.trim()),
				...rest,
			};

			const provider = new Provider(accountFields);
			const createdProvider = await provider.save();
			res.status(201).json(createdProvider);
		} else {
			res.status(400);
			throw new Error("You have already completed your confirmation");
		}
		// While account type is seeker
	} else if (user && user.accountType === "seeker") {
		if (
			seeker.length === 0 ||
			Object.values(seeker).some((seek) => seek.user.toString() !== req.userID)
		) {
			// destructure the request
			const { ages, people, ...rest } = req.body;

			// build a account
			const accountFields = {
				user: req.userID,
				ages: Array.isArray(ages)
					? ages
					: ages.split(",").map((age) => " " + age.trim()),
				people: Array.isArray(people)
					? people
					: people.split(",").map((person) => " " + person.trim()),
				...rest,
			};

			const seeker = new Seeker(accountFields);
			const createdSeeker = await seeker.save();
			res.status(201).json(createdSeeker);
		} else {
			res.status(400);
			throw new Error("You have already completed your confirmation");
		}
		// Whenever userID was invalid/wrong
	} else {
		res.status(404);
		throw new Error("user not found");
	}
});

export { typeLists, matchList };
