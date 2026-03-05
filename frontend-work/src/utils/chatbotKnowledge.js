/**
 * Chatbot knowledge base.
 * Each entry has:
 *   - keywords : words the user message is matched against
 *   - answer   : the bot's reply text
 *   - guide    : (optional) { label, path } — renders a "Guide me" button
 *   - requiresLogin : (optional) true if this action needs auth
 */

import Fuse from "fuse.js";

const knowledge = [
  // ── Creating an ad ───────────────────────────────────────────
  {
    keywords: ["create ad", "create an ad", "post ad", "post an ad", "upload ad", "upload task", "new ad", "make ad", "publish ad"],
    answer:
      "To create an ad you first need an account. Register as a Customer, log in, then click \"Upload Task\" on the home page or open the sidebar and select \"Post New Ad\".",
    guide: { label: "Guide me", path: "/create" },
    requiresLogin: true,
  },

  // ── Registration ─────────────────────────────────────────────
  {
    keywords: ["register", "sign up", "create account", "new account", "make account"],
    answer:
      "You can create an account by clicking \"Create account\" in the menu. Choose whether you are a Customer (post tasks) or a Company (find tasks), fill in your details, and you're good to go!",
    guide: { label: "Guide me", path: "/register" },
  },

  // ── Login ────────────────────────────────────────────────────
  {
    keywords: ["log in", "login", "sign in", "how to login", "cant login", "can't login"],
    answer:
      "Head to the login page, enter the email and password you registered with, and click Log In. If you don't have an account yet, you need to register first.",
    guide: { label: "Guide me", path: "/login" },
  },

  // ── Browse / Find tasks ──────────────────────────────────────
  {
    keywords: ["find task", "browse ad", "browse ads", "search ad", "search task", "look for task", "find work", "find job"],
    answer:
      "You can browse available ads by clicking \"Find Task\" on the home page. If you're a Company, this lets you find tasks posted by customers and make offers on them.",
    guide: { label: "Guide me", path: "/results" },
  },

  // ── My Ads ───────────────────────────────────────────────────
  {
    keywords: ["my ads", "my ad", "my posts", "my tasks", "see my ad", "view my ad", "manage ads"],
    answer:
      "As a Customer you can see all your posted ads in the \"My Ads\" page. Open the sidebar menu and click \"My Ads\".",
    guide: { label: "Guide me", path: "/my-ads" },
    requiresLogin: true,
  },

  // ── My Offers ────────────────────────────────────────────────
  {
    keywords: ["my offers", "my offer", "offers i made", "view offers", "see offers"],
    answer:
      "As a Company you can track your submitted offers in the \"My Offers\" page. Open the sidebar menu and click \"My Offers\".",
    guide: { label: "Guide me", path: "/my-offers" },
    requiresLogin: true,
  },

  // ── Profile ──────────────────────────────────────────────────
  {
    keywords: ["profile", "my profile", "account settings", "edit profile", "view profile"],
    answer:
      "You can view and manage your profile from the sidebar. Click the menu icon and select \"Profile\".",
    guide: { label: "Guide me", path: "/profile" },
    requiresLogin: true,
  },

  // ── Offers / bidding ─────────────────────────────────────────
  {
    keywords: ["make offer", "send offer", "place offer", "bid", "how offer", "submit offer"],
    answer:
      "To make an offer on a task, browse the available ads, open one that interests you, and click the offer button. You need to be logged in as a Company.",
    guide: { label: "Guide me", path: "/results" },
    requiresLogin: true,
  },

  // ── Contracts ────────────────────────────────────────────────
  {
    keywords: ["contract", "contracts", "sign contract", "view contract"],
    answer:
      "Once an offer is accepted, a contract is created between the customer and the company. You can view and sign contracts from the ad or offer details.",
    requiresLogin: true,
  },

  // ── Negotiate ────────────────────────────────────────────────
  {
    keywords: ["negotiate", "negotiation", "chat", "message", "discussion"],
    answer:
      "After an offer is submitted you can negotiate details with the other party through the negotiation chat on the offer page.",
    requiresLogin: true,
  },

  // ── Roles ────────────────────────────────────────────────────
  {
    keywords: ["role", "customer", "company", "difference", "what is customer", "what is company"],
    answer:
      "There are two roles: Customer — posts tasks and hires help, and Company — browses tasks and makes offers to work on them.",
  },

  // ── About ────────────────────────────────────────────────────
  {
    keywords: ["about", "what is workflow", "what does workflow do", "about workflow", "what is this"],
    answer:
      "WorkFlow is a platform that connects customers who need tasks done with companies that can do them. Customers post ads, companies make offers, and they work together through contracts.",
  },

  // ── Logout ───────────────────────────────────────────────────
  {
    keywords: ["log out", "logout", "sign out", "how to logout"],
    answer:
      "To log out, open the sidebar menu and click \"Log out\" at the bottom.",
  },

  // ── Help ─────────────────────────────────────────────────────
  {
    keywords: ["help", "support", "assist", "how does this work", "how to use"],
    answer:
      "I'm Flowie, your WorkFlow assistant! You can ask me things like:\n• How do I create an ad?\n• How do I register?\n• How do I find tasks?\n• What is the difference between Customer and Company?\nJust type your question!",
  },

  // ── Who is Flowie ────────────────────────────────────────────
  {
    keywords: ["who are you", "your name", "what are you", "flowie", "what is flowie", "who is flowie", "the character", "the painter", "the guy on the home page", "mascot"],
    answer:
      "I'm Flowie! I'm the little painter you see on the home page. I'm here to help you navigate WorkFlow and answer your questions!",
  },
];

// ── Fuzzy search setup ──────────────────────────────────────────

const searchData = knowledge.map((entry) => ({
  text: entry.keywords.join(" "),
  entry,
}));

const fuse = new Fuse(searchData, {
  keys: ["text"],
  threshold: 0.4,
});

// ── Role conflict detection ─────────────────────────────────────

function detectRoleConflict(message) {
  if (message.includes("create ad") && message.includes("company")) {
    return "Only Customers can create ads. Companies can browse ads and send offers.";
  }
  if (message.includes("offer") && message.includes("customer")) {
    return "Only Companies can send offers. Customers post tasks and receive offers.";
  }
  return null;
}

// ── Main response function ──────────────────────────────────────

export function getResponse(message) {
  const lower = message.toLowerCase().trim();

  // 1. Check for role conflicts first
  const roleWarning = detectRoleConflict(lower);
  if (roleWarning) {
    return { answer: roleWarning, guide: null };
  }

  // 2. Fuzzy search the knowledge base
  const results = fuse.search(lower);

  if (results.length > 0) {
    const match = results[0].item.entry;
    let answer = match.answer;

    // Append a login hint if the action requires auth and user isn't logged in
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const isLoggedIn = !!user?.access_token;

    if (match.requiresLogin && !isLoggedIn) {
      answer += "\n\n⚠️ You need to be logged in to do this.";
      return {
        answer,
        guide: { label: "Go to login", path: "/login" },
      };
    }

    return {
      answer,
      guide: match.guide || null,
    };
  }

  // 3. Fallback
  return {
    answer: "Sorry, I'm new in this world :)",
    guide: null,
  };
}
