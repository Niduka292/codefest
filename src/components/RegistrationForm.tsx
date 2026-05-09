"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Plus, Trash2, Zap } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { ParticipantInsert } from "@/lib/types";

const languages = ["Python", "Java", "C++", "JavaScript", "HTML", "Other"];
const maxAdditionalMembers = 4;

type TeamMember = {
  full_name: string;
  student_id: string;
};

export function RegistrationForm() {
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["Python"]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([{ full_name: "", student_id: "" }]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function toggleLanguage(language: string) {
    setSelectedLanguages((current) =>
      current.includes(language) ? current.filter((item) => item !== language) : [...current, language],
    );
  }

  function updateTeamMember(index: number, field: keyof TeamMember, value: string) {
    setTeamMembers((current) =>
      current.map((member, memberIndex) =>
        memberIndex === index ? { ...member, [field]: value } : member,
      ),
    );
  }

  function addTeamMember() {
    setTeamMembers((current) =>
      current.length >= maxAdditionalMembers ? current : [...current, { full_name: "", student_id: "" }],
    );
  }

  function removeTeamMember(index: number) {
    setTeamMembers((current) => current.filter((_, memberIndex) => memberIndex !== index));
  }

  function goToMembersStep(form: HTMLFormElement) {
    const formData = new FormData(form);
    const hasLeaderDetails =
      String(formData.get("team_name") ?? "").trim() &&
      String(formData.get("full_name") ?? "").trim() &&
      String(formData.get("email") ?? "").trim() &&
      String(formData.get("student_id") ?? "").trim() &&
      selectedLanguages.length > 0;

    if (!hasLeaderDetails) {
      setError("Team name, leader details, and at least one language are required.");
      return;
    }

    setError("");
    setStep(2);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(event.currentTarget);
    const teamName = String(form.get("team_name") ?? "").trim();
    const fullName = String(form.get("full_name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const studentId = String(form.get("student_id") ?? "").trim();
    const academicYear = String(form.get("academic_year") ?? "");

    const cleanedTeamMembers = teamMembers
      .map((member) => ({
        full_name: member.full_name.trim(),
        student_id: member.student_id.trim(),
      }))
      .filter((member) => member.full_name || member.student_id);

    // Validation
    if (!teamName || !fullName || !email || !studentId || selectedLanguages.length === 0) {
      setError("Team name, leader details, and at least one language are required.");
      setLoading(false);
      return;
    }

    const hasIncompleteMember = cleanedTeamMembers.some(
      (member) => !member.full_name || !member.student_id
    );

    if (hasIncompleteMember) {
      setError("Each team member needs both a full name and student ID.");
      setLoading(false);
      return;
    }

    // Single transactional RPC call — all inserts roll back on any error
    const { error: rpcError } = await supabase.rpc("register_team", {
      p_team_name: teamName,
      p_full_name: fullName,
      p_email: email,
      p_student_id: studentId,
      p_programming_languages: selectedLanguages,
      p_academic_year: academicYear,
      p_members: cleanedTeamMembers,
    });

    if (rpcError) {
      if (rpcError.message.includes("UNIQUE_VIOLATION")) {
        if (rpcError.message.includes("email")) {
          setError("This email is already registered. Each participant can only register once.");
        } else if (rpcError.message.includes("student_id")) {
          setError("This student ID is already registered. Each participant can only register once.");
        } else if (rpcError.message.includes("team")) {
          setError("This team name is already taken. Please choose a different name.");
        } else {
          setError("A duplicate entry was detected. Please check your details.");
        }
      } else {
        setError(rpcError.message);
      }
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }
  if (success) {
    return (
      <div className="relative overflow-hidden border border-cyan-300/40 bg-[#111118] p-8 text-center shadow-[0_0_60px_rgba(34,211,238,0.16)]">
        <div className="pointer-events-none absolute inset-0">
          <span className="absolute left-8 top-8 h-2 w-2 animate-ping bg-cyan-300" />
          <span className="absolute right-10 top-16 h-2 w-2 animate-pulse bg-purple-400" />
          <span className="absolute bottom-10 left-1/3 h-2 w-2 animate-ping bg-amber-300" />
        </div>
        <CheckCircle2 className="mx-auto text-cyan-300" size={58} />
        <h2 className="font-display mt-6 text-4xl font-black uppercase text-white">Your Team Is In The Arena</h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-zinc-400">
          Your team registration has been recorded. Watch the leaderboard and prepare for the opening signal.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border border-[#1f1f2e] bg-[#111118]/95 p-5 shadow-[0_0_50px_rgba(139,92,246,0.1)] sm:p-8">
      <h2 className="font-display text-3xl font-black uppercase tracking-wide text-white">Team Registration</h2>
      <p className="mt-2 text-sm text-zinc-500">Team leaders complete entry for the University Finals.</p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setStep(1)}
          className={`border px-4 py-3 text-xs font-black uppercase tracking-widest transition-all duration-300 ${step === 1
            ? "border-purple-400 bg-purple-500/15 text-white"
            : "border-[#1f1f2e] bg-black/20 text-zinc-500 hover:text-white"
            }`}
        >
          Step 1 Leader
        </button>
        <button
          type="button"
          onClick={(event) => goToMembersStep(event.currentTarget.form as HTMLFormElement)}
          className={`border px-4 py-3 text-xs font-black uppercase tracking-widest transition-all duration-300 ${step === 2
            ? "border-cyan-300 bg-cyan-300/10 text-white"
            : "border-[#1f1f2e] bg-black/20 text-zinc-500 hover:text-white"
            }`}
        >
          Step 2 Members
        </button>
      </div>

      <div className="mt-8 space-y-5">
        <div className={step === 1 ? "space-y-5" : "hidden"}>
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-500">Team Name</span>
            <input name="team_name" type="text" placeholder="TEAM NAME" className="codefest-field" required />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-500">Team Leader Name</span>
            <input name="full_name" type="text" placeholder="TEAM LEADER NAME" className="codefest-field" required />
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-500">Leader Email Address</span>
              <input name="email" type="email" placeholder="LEADER EMAIL ADDRESS" className="codefest-field" required />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-500">Leader Student ID</span>
              <input name="student_id" type="text" placeholder="LEADER STUDENT ID" className="codefest-field font-mono" required />
            </label>
          </div>

          <div>
            <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-zinc-500">
              Programming Languages
            </span>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {languages.map((language) => (
                <label
                  key={language}
                  className="flex cursor-pointer items-center gap-3 border border-[#2d2d44] bg-[#1a1a2e] px-4 py-3 text-sm font-bold text-zinc-200 transition-all duration-300 hover:border-purple-400"
                >
                  <input
                    type="checkbox"
                    checked={selectedLanguages.includes(language)}
                    onChange={() => toggleLanguage(language)}
                    className="h-4 w-4 accent-purple-500"
                  />
                  {language}
                </label>
              ))}
            </div>
          </div>

          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-500">Leader Academic Year</span>
            <select name="academic_year" className="codefest-field" defaultValue="Year 1">
              <option>Year 1</option>
              <option>Year 2</option>
              <option>Year 3</option>
            </select>
          </label>

          <button
            type="button"
            onClick={(event) => goToMembersStep(event.currentTarget.form as HTMLFormElement)}
            className="codefest-button w-full border border-cyan-300/60 px-5 py-4 text-sm text-cyan-200 hover:bg-cyan-300/10"
          >
            Continue To Team Members
          </button>
        </div>

        <div className={step === 2 ? "space-y-5" : "hidden"}>
          <div className="border border-purple-400/30 bg-purple-500/10 p-4">
            <p className="text-xs font-black uppercase tracking-widest text-purple-200">Member 1</p>
            <p className="mt-2 text-sm text-zinc-400">
              The team leader is automatically counted as member 1.
            </p>
          </div>

          <div>
            <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="block text-xs font-bold uppercase tracking-widest text-zinc-500">
                Additional Team Members
              </span>
              <button
                type="button"
                onClick={addTeamMember}
                disabled={teamMembers.length >= maxAdditionalMembers}
                className="codefest-button border border-cyan-300/50 px-3 py-2 text-[10px] text-cyan-200 hover:bg-cyan-300/10"
              >
                <Plus size={14} />
                Add Member
              </button>
            </div>

            <div className="space-y-3">
              {teamMembers.map((member, index) => (
                <div key={index} className="grid gap-3 border border-[#1f1f2e] bg-black/20 p-3 md:grid-cols-[1fr_0.8fr_auto]">
                  <input
                    type="text"
                    value={member.full_name}
                    onChange={(event) => updateTeamMember(index, "full_name", event.target.value)}
                    placeholder={`MEMBER ${index + 2} FULL NAME`}
                    className="codefest-field"
                  />
                  <input
                    type="text"
                    value={member.student_id}
                    onChange={(event) => updateTeamMember(index, "student_id", event.target.value)}
                    placeholder="STUDENT ID"
                    className="codefest-field font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => removeTeamMember(index)}
                    disabled={teamMembers.length === 1}
                    aria-label="Remove team member"
                    className="inline-flex h-12 items-center justify-center border border-red-500/30 px-4 text-red-300 transition-all duration-300 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              ))}
            </div>

            <p className="mt-2 text-xs uppercase tracking-widest text-zinc-600">
              Add up to {maxAdditionalMembers} more members.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-[auto_1fr]">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="codefest-button border border-[#2d2d44] px-5 py-4 text-sm text-zinc-300 hover:border-purple-400 hover:text-white"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="codefest-button w-full bg-gradient-to-r from-purple-600 to-cyan-500 px-5 py-4 text-sm text-white shadow-[0_0_36px_rgba(139,92,246,0.2)] hover:scale-[1.01]"
            >
              {loading ? "Entering..." : "Enter The Arena"}
              <Zap size={16} />
            </button>
          </div>
        </div>
      </div>

      {error ? <p className="mt-5 border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</p> : null}

      <p className="mt-4 text-center text-xs leading-6 text-zinc-600">
        By submitting, you agree to competition rules, eligibility review, and event communications.
      </p>
    </form>
  );
}
