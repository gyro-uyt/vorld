import React, { useState, useEffect } from "react";
import {
  Terminal,
  Layers,
  Cpu,
  Monitor,
  Code2,
  Settings,
  User,
  Copy,
  CheckCircle2,
  Circle,
  Menu,
  X,
  Save,
  Trash2,
  Command,
  Download,
} from "lucide-react";

// --- Data Structure for your Setup ---
// Edit this object to customize your actual stack
const SETUP_LAYERS = [
  {
    id: "layer-0",
    title: "Layer 0: Core OS",
    icon: <Cpu size={20} />,
    description: "Base system, kernel, and hardware config",
    items: [
      {
        id: "arch-linux",
        name: "Endeavour",
        desc: "Base installation",
        cmd: "pacstrap /mnt base linux linux-firmware",
        tags: ["OS"],
      },
      {
        id: "bootloader",
        name: "GRUB",
        desc: "Bootloader configuration",
        cmd: "grub-install --target=x86_64-efi --efi-directory=/boot --bootloader-id=GRUB",
        tags: ["System"],
      },
      {
        id: "aur-helper",
        name: "Yay",
        desc: "AUR Helper",
        cmd: "git clone https://aur.archlinux.org/yay.git && cd yay && makepkg -si",
        tags: ["AUR"],
      },
      {
        id: "drivers",
        name: "Nvidia Drivers",
        desc: "Proprietary drivers",
        cmd: "pacman -S nvidia nvidia-utils",
        tags: ["Drivers"],
      },
    ],
  },
  {
    id: "layer-1",
    title: "Layer 1: Shell & CLI",
    icon: <Terminal size={20} />,
    description: "Terminal environment and CLI utilities",
    items: [
      {
        id: "shell",
        name: "Bash",
        desc: "Default shell",
        cmd: "pacman -S bash",
        tags: ["Shell"],
      },
      {
        id: "prompt",
        name: "Starship",
        desc: "Cross-shell prompt",
        cmd: "pacman -S starship",
        tags: ["UI"],
      },
      {
        id: "editor-cli",
        name: "Neovim",
        desc: "CLI Text Editor",
        cmd: "pacman -S neovim",
        tags: ["Editor"],
      },
      {
        id: "blesh",
        name: "Ble.sh",
        desc: "Bash Line Editor (Syntax highlight & Autosuggest)",
        cmd: "soon",
        tags: ["Utility"],
      },
      // {
      //   id: "cli-utils",
      //   name: "Modern Utils",
      //   desc: "Bat, Eza, Ripgrep, Fzf",
      //   cmd: "pacman -S bat eza ripgrep fzf",
      //   tags: ["Utils"],
      // },
      // {
      //   id: "tmux",
      //   name: "Tmux",
      //   desc: "Terminal Multiplexer",
      //   cmd: "pacman -S tmux",
      //   tags: ["Utils"],
      // },
    ],
  },
  {
    id: "layer-2",
    title: "Layer 2: Desktop Env",
    icon: <Monitor size={20} />,
    description: "KDE Plasma, Terminal & Fonts",
    items: [
      {
        id: "de",
        name: "KDE Plasma",
        desc: "Desktop Environment",
        // Installs Plasma and the SDDM login screen, then enables it
        cmd: "soon",
        // cmd: "sudo pacman -S plasma-meta sddm && sudo systemctl enable sddm",
        tags: ["DE", "Wayland"],
      },
      {
        id: "term-emu",
        name: "Kitty",
        desc: "GPU accelerated terminal",
        cmd: "sudo pacman -S kitty",
        tags: ["Terminal"],
      },
      {
        id: "fonts",
        name: "Nerd Fonts",
        desc: "JetBrains Mono Nerd Font",
        cmd: "sudo pacman -S ttf-jetbrains-mono-nerd",
        tags: ["Fonts"],
      },
      {
        id: "kde-apps",
        name: "KDE Gear",
        desc: "Dolphin, Ark, Spectacle",
        cmd: "sudo pacman -S kde-applications",
        tags: ["Apps"],
      },
    ],
  },
  {
    id: "layer-3",
    title: "Layer 3: Dev Stack",
    icon: <Code2 size={20} />,
    description: "Languages, IDEs, and Containers",
    items: [
      {
        id: "vscode",
        name: "VS Code",
        desc: "Code Editor",
        cmd: "yay -S visual-studio-code-bin",
        tags: ["IDE"],
      },
      {
        id: "zed",
        name: "Zed",
        desc: "Code Editor",
        cmd: "soon",
        tags: ["IDE"],
      },
      {
        id: "neovim",
        name: "LazyVim",
        desc: "Code Editor",
        cmd: "soon",
        tags: ["IDE"],
      },
      // {
      //   id: "docker",
      //   name: "Docker",
      //   desc: "Containerization",
      //   cmd: "pacman -S docker docker-compose && systemctl enable docker",
      //   tags: ["DevOps"],
      // },
      // {
      //   id: "node",
      //   name: "Node.js & Bun",
      //   desc: "JS Runtimes",
      //   cmd: "pacman -S nodejs npm bun",
      //   tags: ["Lang"],
      // },
      // {
      //   id: "rust",
      //   name: "Rust",
      //   desc: "Cargo & Rustc",
      //   cmd: "pacman -S rustup && rustup default stable",
      //   tags: ["Lang"],
      // },
    ],
  },
  {
    id: "layer-4",
    title: "Layer 4: Apps & Exts",
    icon: <Layers size={20} />,
    description: "Daily driver applications and extensions",
    items: [
      {
        id: "browser",
        name: "Firefox",
        desc: "Primary Browser",
        cmd: "pacman -S firefox",
        tags: ["Web"],
      },
      {
        id: "onlyoffice",
        name: "Onlyoffice",
        desc: "Word, Excel, Presentation, PDF",
        cmd: "yay -S onlyoffice",
        tags: ["office"],
      },
      {
        id: "obsidian",
        name: "Obsidian",
        desc: "Knowledge Base",
        cmd: "pacman -S obsidian",
        tags: ["Productivity"],
      },
      {
        id: "extensions-browser",
        name: "Browser Exts",
        desc: "uBlock, Dark Reader, Bitwarden",
        cmd: null, // No command, manual install
        note: "Install from Add-on Store manually",
        tags: ["Extensions"],
      },
    ],
  },
  {
    id: "layer-5",
    title: "Personal Config",
    icon: <User size={20} />,
    description: "Dotfiles and specific personal tweaks",
    items: [
      {
        id: "dotfiles",
        name: "Dotfiles Repo",
        desc: "Clone my config",
        cmd: "git clone https://github.com/yourusername/dotfiles.git ~/.dotfiles",
        tags: ["Config"],
      },
      {
        id: "ssh-keys",
        name: "SSH Keys",
        desc: "Generate GitHub keys",
        cmd: 'ssh-keygen -t ed25519 -C "email@example.com"',
        tags: ["Security"],
      },
      {
        id: "git-config",
        name: "Git Identity",
        desc: "Set global user",
        cmd: 'git config --global user.name "Your Name" && git config --global user.email "you@example.com"',
        tags: ["Config"],
      },
    ],
  },
];

// --- Components ---

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // Fallback for iframe environments where navigator.clipboard might be restricted
    try {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text);
      } else {
        // Fallback method
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        handleCopy();
      }}
      className={`p-2 rounded-md transition-all duration-200 ${
        copied
          ? "bg-green-500/20 text-green-400"
          : "bg-slate-700 hover:bg-slate-600 text-slate-300"
      }`}
      title="Copy Command"
    >
      {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
    </button>
  );
};

const Tag = ({ text }) => (
  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-cyan-900/40 text-cyan-300 border border-cyan-800/50">
    {text}
  </span>
);

export default function ArchSetupHub() {
  const [activeLayer, setActiveLayer] = useState(SETUP_LAYERS[0].id);
  const [reinstallMode, setReinstallMode] = useState(false);
  const [completedItems, setCompletedItems] = useState({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem("arch_setup_progress");
    if (savedProgress) {
      setCompletedItems(JSON.parse(savedProgress));
    }
  }, []);

  // Save progress
  const toggleItemComplete = (itemId) => {
    const newCompleted = {
      ...completedItems,
      [itemId]: !completedItems[itemId],
    };
    setCompletedItems(newCompleted);
    localStorage.setItem("arch_setup_progress", JSON.stringify(newCompleted));
  };

  const resetProgress = () => {
    if (
      window.confirm("Are you sure you want to clear all progress checkboxes?")
    ) {
      setCompletedItems({});
      localStorage.removeItem("arch_setup_progress");
    }
  };

  const getActiveLayerData = () =>
    SETUP_LAYERS.find((l) => l.id === activeLayer);

  // Calculate progress for current layer
  const getLayerProgress = (layer) => {
    const total = layer.items.length;
    const done = layer.items.filter((i) => completedItems[i.id]).length;
    return {
      total,
      done,
      percent: total === 0 ? 0 : Math.round((done / total) * 100),
    };
  };

  const overallProgress = () => {
    let total = 0;
    let done = 0;
    SETUP_LAYERS.forEach((l) => {
      total += l.items.length;
      done += l.items.filter((i) => completedItems[i.id]).length;
    });
    return total === 0 ? 0 : Math.round((done / total) * 100);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30">
      {/* Top Mobile Bar */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 font-bold text-cyan-400">
          <Terminal size={20} />
          <span>ARCH_HUB</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-400"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static flex flex-col
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        >
          <div className="p-6 border-b border-slate-800 hidden lg:flex items-center gap-2 font-bold text-xl text-cyan-400">
            <Terminal size={24} />
            <span>ARCH_HUB</span>
          </div>

          <div className="p-4 border-b border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Reinstall Mode
              </span>
              <button
                onClick={() => setReinstallMode(!reinstallMode)}
                className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${
                  reinstallMode ? "bg-cyan-600" : "bg-slate-700"
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform duration-300 ${
                    reinstallMode ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
            {reinstallMode && (
              <div className="mt-4 bg-slate-800/50 rounded p-3">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-xs text-slate-400">Setup Progress</span>
                  <span className="text-xs font-mono text-cyan-400">
                    {overallProgress()}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 transition-all duration-500"
                    style={{ width: `${overallProgress()}%` }}
                  />
                </div>
                <button
                  onClick={resetProgress}
                  className="mt-3 text-xs flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors w-full justify-center"
                >
                  <Trash2 size={10} /> Reset Progress
                </button>
              </div>
            )}
          </div>

          <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
            {SETUP_LAYERS.map((layer) => {
              const progress = getLayerProgress(layer);
              const isDone = progress.percent === 100;

              return (
                <button
                  key={layer.id}
                  onClick={() => {
                    setActiveLayer(layer.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 group relative
                    ${
                      activeLayer === layer.id
                        ? "bg-cyan-900/20 text-cyan-400 border border-cyan-800/50"
                        : "text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent"
                    }
                  `}
                >
                  <div
                    className={`${
                      activeLayer === layer.id
                        ? "text-cyan-400"
                        : "text-slate-500 group-hover:text-slate-300"
                    }`}
                  >
                    {layer.icon}
                  </div>
                  <span className="font-medium truncate">{layer.title}</span>

                  {reinstallMode && (
                    <div className="ml-auto text-xs font-mono opacity-60">
                      {isDone ? (
                        <CheckCircle2 size={14} className="text-green-500" />
                      ) : (
                        <span>
                          {progress.done}/{progress.total}
                        </span>
                      )}
                    </div>
                  )}

                  {activeLayer === layer.id && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-500 rounded-r-full" />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-800 text-xs text-slate-600 text-center">
            <p>I use Arch btw.</p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-slate-950 relative">
          <div className="max-w-4xl mx-auto px-6 py-10">
            {/* Header */}
            <header className="mb-10">
              <div className="flex items-center gap-2 text-cyan-500 mb-2">
                {getActiveLayerData().icon}
                <span className="text-sm font-bold uppercase tracking-widest">
                  Active Layer
                </span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">
                {getActiveLayerData().title}
              </h1>
              <p className="text-lg text-slate-400">
                {getActiveLayerData().description}
              </p>
            </header>

            {/* Content Items */}
            <div className="space-y-4">
              {getActiveLayerData().items.map((item) => {
                const isCompleted = completedItems[item.id];

                return (
                  <div
                    key={item.id}
                    onClick={() => reinstallMode && toggleItemComplete(item.id)}
                    className={`
                      group relative overflow-hidden rounded-xl border transition-all duration-300
                      ${reinstallMode ? "cursor-pointer" : ""}
                      ${
                        isCompleted
                          ? "bg-slate-900/30 border-slate-800 opacity-60"
                          : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:shadow-xl hover:shadow-cyan-900/5"
                      }
                    `}
                  >
                    {/* Status Indicator Bar for Checklist */}
                    {reinstallMode && (
                      <div
                        className={`absolute left-0 top-0 bottom-0 w-1.5 transition-colors ${
                          isCompleted ? "bg-green-500" : "bg-slate-700"
                        }`}
                      />
                    )}

                    <div className={`p-5 ${reinstallMode ? "pl-8" : ""}`}>
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          {reinstallMode && (
                            <div
                              className={`mt-1 transition-colors ${
                                isCompleted
                                  ? "text-green-500"
                                  : "text-slate-600"
                              }`}
                            >
                              {isCompleted ? (
                                <CheckCircle2 size={24} />
                              ) : (
                                <Circle size={24} />
                              )}
                            </div>
                          )}

                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3
                                className={`font-bold text-lg ${
                                  isCompleted
                                    ? "text-slate-400 line-through"
                                    : "text-white"
                                }`}
                              >
                                {item.name}
                              </h3>
                              <div className="flex gap-1">
                                {item.tags.map((tag) => (
                                  <Tag key={tag} text={tag} />
                                ))}
                              </div>
                            </div>
                            <p className="text-slate-400 text-sm mb-3">
                              {item.desc}
                            </p>

                            {item.note && (
                              <div className="text-amber-400/80 text-xs italic mb-2 bg-amber-900/10 px-2 py-1 rounded w-fit">
                                Note: {item.note}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Area */}
                        {item.cmd && (
                          <div className="w-full sm:w-auto min-w-[300px] shrink-0">
                            <div className="relative group/code">
                              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg blur opacity-0 group-hover/code:opacity-20 transition duration-500"></div>
                              <div className="relative flex items-center bg-slate-950 rounded-lg border border-slate-800 overflow-hidden">
                                <div className="px-3 py-2 text-slate-500 border-r border-slate-800 select-none">
                                  <Command size={14} />
                                </div>
                                <code className="flex-1 px-3 py-2 text-xs sm:text-sm font-mono text-cyan-300 overflow-x-auto whitespace-nowrap scrollbar-hide">
                                  {item.cmd}
                                </code>
                                <div className="border-l border-slate-800">
                                  <CopyButton text={item.cmd} />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty State/Tip */}
            {getActiveLayerData().items.length === 0 && (
              <div className="text-center py-20 text-slate-500">
                <Settings size={48} className="mx-auto mb-4 opacity-50" />
                <p>No items configured for this layer yet.</p>
              </div>
            )}

            {/* Footer for Layer */}
            <div className="mt-12 pt-6 border-t border-slate-900 flex justify-between items-center text-slate-600 text-sm">
              <span>{getActiveLayerData().id}</span>
              <span className="font-mono">Configured by You</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
