import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Question from "../components/Question";

const STORAGE_PREFIX = "mm_onboarding_v1";

const SAMPLE_QUESTIONS = [
	{
		id: "q1",
		type: "multiple-choice",
		prompt: "What's your primary role?",
		options: [
			{ id: "guest", label: "Guest / Traveler" },
			{ id: "staff", label: "Hotel staff" },
			{ id: "dev", label: "Developer / Enthusiast" },
		],
		required: true,
	},
		{
			id: "q2",
			type: "multi-select",
			prompt: "Which of the following categories you interested in? (multi-select)",
			options: [
				{ id: "nature", label: "nature" },
				{ id: "museums", label: "museums" },
				{ id: "theatres_and_entertainments", label: "theatres_and_entertainments" },
				{ id: "urban_environment", label: "urban_environment" },
				{ id: "historic", label: "historic" },
				{ id: "religion", label: "religion" },
				{ id: "architecture", label: "architecture" },
				{ id: "industrial_facilities", label: "industrial_facilities" },
				{ id: "amusements", label: "amusements" },
				{ id: "sport", label: "sport" },
				{ id: "adult", label: "adult" },
				{ id: "shops", label: "shops" },
				{ id: "foods", label: "foods" },
			],
		},
];

export default function Onboarding() {
	const navigate = useNavigate();
	const [user, setUser] = useState(null);
	const [answers, setAnswers] = useState({});
	const [index, setIndex] = useState(0);

	useEffect(() => {
		try {
			const raw = localStorage.getItem("mm_current_user") || null;
			if (!raw) return navigate("/");
			const parsed = JSON.parse(raw);
			setUser(parsed);

			// load saved answers for this user
			const key = `${STORAGE_PREFIX}:${parsed.id}`;
			const saved = localStorage.getItem(key);
			if (saved) setAnswers(JSON.parse(saved));
		} catch (e) {
			console.error(e);
		}
	}, [navigate]);

	const questions = useMemo(() => SAMPLE_QUESTIONS, []);
		// Build an expanded questions array that inserts a follow-up ratings question
		// after the interests question when interests have been selected.
		const expandedQuestions = useMemo(() => {
			const base = [...questions];
			// find interests (q2) selections
			const interests = answers["q2"] || [];
			if (Array.isArray(interests) && interests.length > 0) {
				const options = (SAMPLE_QUESTIONS.find((q) => q.id === "q2")?.options || [])
					.filter((o) => interests.includes(o.id))
					.map((o) => ({ id: o.id, label: o.label }));

				const ratingsQuestion = {
					id: "q2_ratings",
					type: "interest-ratings",
					prompt: "For each interest, how would you rate your interest?",
					options,
				};

				// Insert after q2
				const idx = base.findIndex((q) => q.id === "q2");
				if (idx >= 0) {
					base.splice(idx + 1, 0, ratingsQuestion);
				} else {
					base.push(ratingsQuestion);
				}
			}

			return base;
		}, [questions, answers]);

	useEffect(() => {
		if (!user) return;
		const key = `${STORAGE_PREFIX}:${user.id}`;
		localStorage.setItem(key, JSON.stringify(answers));
	}, [answers, user]);

	function updateAnswer(qid, value) {
		setAnswers((prev) => ({ ...prev, [qid]: value }));
	}

		function canProceedToNext() {
			const q = expandedQuestions[index];
		if (q && q.required) {
			const a = answers[q.id];
			return a !== undefined && a !== null && !(Array.isArray(a) && a.length === 0) && a !== "";
		}
		return true;
	}

	function handleNext() {
		if (!canProceedToNext()) return alert("Please answer the required question.");
			if (index < expandedQuestions.length - 1) setIndex((i) => i + 1);
		else handleSubmit();
	}

	function handleBack() {
		if (index > 0) setIndex((i) => i - 1);
		else navigate(-1);
	}

	function handleSubmit() {
		// In a real app, POST answers to server. For now, mark user as onboarded locally.
		const updated = { ...(user || {}), onboarded: true };
		localStorage.setItem("mm_current_user", JSON.stringify(updated));

		// Build a scores array length 14 (indices 0..13) from interest ratings.
		// Assumption: the interests map to indices in this order (0..12). Index 13 is reserved for future/other.
		const INTEREST_INDEX = {
			"nature": 0,
			"museums": 1,
			"theatres_and_entertainments": 2,
			"urban_environment": 3,
			"historic": 4,
			"religion": 5,
			"architecture": 6,
			"industrial_facilities": 7,
			"amusements": 8,
			"sport": 9,
			"adult": 10,
			"shops": 11,
			"foods": 12,
			// 13 reserved for 'other' or future categories
		};
		{/*onboarding array */}
		const scores = new Array(13).fill(0);
		const ratings = answers["q2_ratings"] || {};

		function ratingToValue(r) {
			switch ((r || "").toLowerCase()) {
				case "high":
					return 1;
				case "medium":
					return 0.5;
				case "low":
					return 0.25;
				default:
					return 0;
			}
		}

		Object.keys(ratings).forEach((interestId) => {
			const idx = INTEREST_INDEX[interestId];
			if (typeof idx === "number") {
				scores[idx] = ratingToValue(ratings[interestId]);
			}
		});

		// optionally store final answers and computed scores under a dedicated key
		localStorage.setItem(`mm_onboarding_result:${user.id}`, JSON.stringify({ answers, scores, submittedAt: Date.now() }));

		// Debug: print scores array to console so developers can verify mapping
		console.log("onboarding scores:", scores);

		navigate("/dashboard");
	}

	if (!user) return null;

		const currentQ = expandedQuestions[index];

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
			<div className="w-full max-w-2xl">
				<div className="bg-white p-6 rounded-lg shadow">
					<h2 className="text-gray-500 text-2xl font-semibold mb-2">Welcome! A quick onboarding</h2>
					<p className="text-gray-500 mb-4">Help us personalize your experience. This will only take a moment.</p>

					<div className="mb-4 text-gray-500">
						<div className="mb-3 text-sm text-gray-600">Question {index + 1} of {expandedQuestions.length}</div>
						<Question question={currentQ} value={answers[currentQ.id]} onChange={(v) => updateAnswer(currentQ.id, v)} />
					</div>

					<div className="flex justify-between items-center mt-4">
						<button onClick={handleBack} className="px-4 py-2 text-white bg-red-500 rounded border">Back</button>
						<div className="flex items-center gap-3">
							<button onClick={() => {
								// quick save to localStorage - already handled by useEffect but allow explicit
								const key = `${STORAGE_PREFIX}:${user.id}`;
								localStorage.setItem(key, JSON.stringify(answers));
								alert("Progress saved locally.");
							}} className="text-sm text-gray-500">Save</button>
							<button onClick={handleNext} className="px-4 py-2 bg-[#B81843] text-white rounded">{index < expandedQuestions.length - 1 ? 'Next' : 'Finish'}</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
