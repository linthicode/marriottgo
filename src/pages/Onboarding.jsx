import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Question from "../components/Question";
import { createOrUpdateProfile } from "../api/profiles";

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

			// Check if user has already completed onboarding
			if (parsed.onboarded) {
				console.log('User has already completed onboarding, redirecting to dashboard');
				navigate("/dashboard");
				return;
			}

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

	async function handleSubmit() {
		console.log("=== ONBOARDING SUBMIT DEBUG ===");
		console.log("User:", user);
		console.log("Answers:", answers);
		
		// Build a scores array length 13 (indices 0..12) from interest ratings.
		// Assumption: the interests map to indices in this order (0..12).
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
		};
		
		const scores = new Array(13).fill(0);
		const ratings = answers["q2_ratings"] || {};

		console.log("Interest ratings:", ratings);

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

		// Debug: print scores array to console so developers can verify mapping
		console.log("Calculated embeddings:", scores);
		console.log("User ID:", user.id);
		console.log("User ID type:", typeof user.id);

		// Validate user ID
		if (!user || !user.id) {
			console.error("No user ID found! User:", user);
			alert("Error: No user ID found. Please try logging in again.");
			return;
		}

		try {
			// Save user profile with embeddings to Supabase
			console.log("Attempting to save profile to Supabase...");
			const { data: profileData, error: profileError } = await createOrUpdateProfile(
				user.id,
				scores,
				0 // Initial posts count
			);

			if (profileError) {
				console.error("Failed to save profile to Supabase:", profileError);
				console.error("Profile error details:", {
					message: profileError.message,
					details: profileError.details,
					hint: profileError.hint,
					code: profileError.code
				});
				
				// Show user-friendly error message
				alert(`Failed to save profile: ${profileError.message}. Please try again.`);
				return;
			} else {
				console.log("Profile saved successfully:", profileData);
			}
		} catch (error) {
			console.error("Unexpected error saving profile:", error);
			alert(`Unexpected error: ${error.message}. Please try again.`);
			return;
		}

		// Store final answers and computed scores locally
		localStorage.setItem(`mm_onboarding_result:${user.id}`, JSON.stringify({ 
			answers, 
			scores, 
			submittedAt: Date.now() 
		}));

		// Mark user as onboarded locally
		const updated = { ...(user || {}), onboarded: true };
		localStorage.setItem("mm_current_user", JSON.stringify(updated));

		console.log("Onboarding completed successfully!");
		navigate("/dashboard");
	}

	if (!user) return null;

		const currentQ = expandedQuestions[index];

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6">
			<div className="w-full max-w-3xl">
				{/* Progress Header */}
				<div className="mb-8 text-center">
					<div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#a11d2b] to-[#8B1523] text-white rounded-full shadow-lg mb-4">
						<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
						</svg>
					</div>
					<h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to MarriottGo!</h1>
					<p className="text-lg text-gray-600">Let's personalize your experience in just a few steps</p>
				</div>

				{/* Progress Bar */}
				<div className="mb-8">
					<div className="flex justify-between mb-2">
						<span className="text-sm font-semibold text-gray-700">Step {index + 1} of {expandedQuestions.length}</span>
						<span className="text-sm font-semibold text-[#a11d2b]">{Math.round(((index + 1) / expandedQuestions.length) * 100)}%</span>
					</div>
					<div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
						<div 
							className="bg-gradient-to-r from-[#a11d2b] to-[#8B1523] h-3 rounded-full transition-all duration-300 ease-out shadow-md"
							style={{ width: `${((index + 1) / expandedQuestions.length) * 100}%` }}
						/>
					</div>
				</div>

				{/* Question Card */}
				<div className="mb-6">
					<Question question={currentQ} value={answers[currentQ.id]} onChange={(v) => updateAnswer(currentQ.id, v)} />
				</div>

				{/* Navigation */}
				<div className="flex justify-between items-center gap-4">
					<button 
						onClick={handleBack} 
						className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm"
					>
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
						</svg>
						Back
					</button>
					<div className="flex items-center gap-3">
						<button 
							onClick={() => {
								const key = `${STORAGE_PREFIX}:${user.id}`;
								localStorage.setItem(key, JSON.stringify(answers));
								alert("Progress saved successfully!");
							}} 
							className="flex items-center gap-2 px-4 py-3 text-gray-600 hover:text-gray-900 font-medium transition-colors"
						>
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
							</svg>
							Save
						</button>
						<button 
							onClick={handleNext} 
							className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#a11d2b] to-[#8B1523] hover:from-[#8B1523] hover:to-[#a11d2b] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200"
						>
							{index < expandedQuestions.length - 1 ? (
								<>
									<span>Next</span>
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
									</svg>
								</>
							) : (
								<>
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
									</svg>
									<span>Finish</span>
								</>
							)}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
