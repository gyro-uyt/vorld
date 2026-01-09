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
  Trash2,
  Command,
  ChevronDown,
  ChevronUp,
  Keyboard,
  Smartphone,
  FileText,
} from "lucide-react";

// --- Data Structure ---
const SETUP_LAYERS = [
  {
    id: "layer-0",
    title: "Layer 0: Core OS",
    icon: <Cpu size={20} />,
    description: "Base system, kernel, and hardware config",
    items: [
      {
        id: "arch-linux",
        name: "EndeavourOS",
        desc: "Arch-based",
        tags: ["OS"],
        note: "EndeavourOS uses Calamares installer usually, but this is for manual rescue.",
        subCommands: [
          {
            label: "Base installation",
            cmd: "pacstrap /mnt base linux linux-firmware",
          },
        ],
      },
      {
        id: "bootloader",
        name: "GRUB",
        desc: "Bootloader configuration",
        tags: ["System"],
        subCommands: [
          {
            label: "Installation",
            cmd: "grub-install --target=x86_64-efi --efi-directory=/boot --bootloader-id=GRUB",
          },
          {
            label: "Generate Config",
            cmd: "grub-mkconfig -o /boot/grub/grub.cfg",
          },
          { label: "Update Endeavour Theme", cmd: "eos-update-grub" },
        ],
      },
      {
        id: "aur-helper",
        name: "Yay",
        desc: "AUR Helper",
        tags: ["AUR"],
        subCommands: [
          {
            label: "Installation",
            cmd: "git clone https://aur.archlinux.org/yay.git && cd yay && makepkg -si",
          },
        ],
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
        cmd: "pacman -S bash bash-completion",
        tags: ["Shell"],
      },
      {
        id: "prompt",
        name: "Starship",
        desc: "Cross-shell prompt",
        cmd: "pacman -S starship",
        tags: ["UI"],
        note: "Add 'eval \"$(starship init bash)\"' to your .bashrc",
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
        cmd: "soon", // Placeholder as requested
        tags: ["Utility"],
        subCommands: [
          {
            label: "Install (AUR)",
            cmd: "yay -S blesh",
          },
          {
            label: "Install (Manual)",
            cmd: "git clone --recursive https://github.com/akinomyoga/ble.sh.git && make -C ble.sh install",
          },
          {
            label: "Enable in .bashrc",
            cmd: "source ~/.local/share/blesh/ble.sh",
          },
        ],
      },
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
        cmd: "soon",
        tags: ["DE", "Wayland"],
        subCommands: [
          {
            label: "Install Core",
            cmd: "sudo pacman -S plasma-meta sddm",
          },
          {
            label: "Enable Login",
            cmd: "sudo systemctl enable sddm",
          },
        ],
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
        desc: "High-performance Code Editor",
        cmd: "soon",
        tags: ["IDE"],
        subCommands: [{ label: "Install (AUR)", cmd: "yay -S zed-preview" }],
      },
      {
        id: "neovim-lazy",
        name: "LazyVim",
        desc: "Neovim Config Framework",
        cmd: "soon",
        tags: ["IDE", "Config"],
        subCommands: [
          { label: "Backup old nvim", cmd: "mv ~/.config/nvim{,.bak}" },
          {
            label: "Clone LazyVim",
            cmd: "git clone https://github.com/LazyVim/starter ~/.config/nvim",
          },
        ],
      },
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
        name: "OnlyOffice",
        desc: "Word, Excel, Presentation, PDF",
        cmd: "yay -S onlyoffice-bin",
        tags: ["Office"],
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
        cmd: null,
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
        id: "neovim",
        name: "Neovim",
        desc: "Configuring it up...",
        cmd: `pacman -S neovim`,
        tags: ["IDE"],
        subCommands: [
          {
            label:
              "Fix for tree-sitter error (KickStart Nvim): Replace the code block 941:962 in init.lua",
            code: `
 {
    'nvim-treesitter/nvim-treesitter',
    branch = 'master', -- 🔑 THIS is the real fix
    build = ':TSUpdate',
    lazy = true,
    main = 'nvim-treesitter.configs',
    opts = {
      ensure_installed = { 'bash', 'c', 'diff', 'html', 'lua', 'luadoc', 'markdown', 'markdown_inline', 'query', 'vim', 'vimdoc' },
      -- Autoinstall languages that are not installed
      auto_install = true,
      highlight = {
        enable = true,
        -- Some languages depend on vim's regex highlighting system (such as Ruby) for indent rules.
        --  If you are experiencing weird indenting issues, add the language to
        --  the list of additional_vim_regex_highlighting and disabled languages for indent.
        additional_vim_regex_highlighting = { 'ruby' },
      },
      indent = { enable = true, disable = { 'ruby' } },
    },
    -- There are additional nvim-treesitter modules that you can use to interact
    -- with nvim-treesitter. You should go explore a few and see what interests you:
    --
    --    - Incremental selection: Included, see \`:help nvim-treesitter-incremental-selection-mod\`
    --    - Show your current context: https://github.com/nvim-treesitter/nvim-treesitter-context
    --    - Treesitter + textobjects: https://github.com/nvim-treesitter/nvim-treesitter-textobjects
  },
            `,
          },
        ],
      },
    ],
  },
  {
    id: "Mobile",
    title: "Mobile: On the go",
    icon: <Smartphone size={20} />,
    description: "Android & Termux environment",
    items: [
      {
        id: "termux",
        name: "Termux Setup",
        desc: "Complete environment setup",
        note: "If asked at any step for (Y/I/N/O), generally press Enter (default)",
        tags: ["App"],
        subCommands: [
          {
            label: "Download Termux apk from the link below",
            cmd: "https://github.com/termux/termux-app/releases/download/v0.118.3/termux-app_v0.118.3+github-debug_arm64-v8a.apk",
          },
          {
            label: "Update & Upgrade",
            cmd: "pkg update && pkg upgrade",
          },
          {
            label: "Install essentials tools",
            cmd: "pkg install clang build-essential git vim wget tar make gawk vivid",
          },
          {
            label: "Get JetBrains Mono Nerd Font",
            cmd: "mkdir -p ~/.termux && wget -O ~/.termux/font.ttf https://github.com/ryanoasis/nerd-fonts/raw/master/patched-fonts/JetBrainsMono/Ligatures/Regular/JetBrainsMonoNerdFont-Regular.ttf",
          },
          {
            label: "Run this command to refresh Termux immediately:",
            cmd: "termux-reload-settings",
          },
          {
            label: "Install ble.sh (Bash Line Editor)",
            cmd: "git clone --recursive https://github.com/akinomyoga/ble.sh.git && make -C ble.sh install PREFIX=~/.local",
          },
          {
            label: "Install starship",
            cmd: "pkg install starship",
          },
          {
            label: "Configure .bashrc (Copy this file)",
            code: `
# --- 1. SETUP BLE.SH (Must be at the very top) ---
# We source it, but with --noattach so it waits for Starship
[[ $- == *i* ]] && source ~/ble.sh/out/ble.sh --noattach

# If not running interactively, don't do anything
[[ $- != *i* ]] && return

#### --- BASIC SETTINGS --- ####
stty -ixon
HISTCONTROL=ignoredups:erasedups
HISTSIZE=5000
HISTFILESIZE=10000
shopt -s histappend

# Bash completion
if [ -f /usr/share/bash-completion/bash_completion ]; then
    . /usr/share/bash-completion/bash_completion
fi

#### --- LS COLORS --- ####
# Keep this! Starship handles the prompt, but Vivid handles 'ls' output.
export LS_COLORS="$(vivid generate tokyonight-moon)"

alias ls='ls --color=auto'
alias ll='ls -alF'
alias la='ls -A'
alias l='ls -CF'
alias grep='grep --color=auto'

#### --- CUSTOM ALIASES --- ####
alias ..='cd ..'
alias ...='cd ../..'
alias update='sudo pacman -Syu'
alias cls='clear'

# -----------------------------------------------------------
#  DELETED SECTION:
#  I removed all your manual functions:
#  - git_branch()
#  - python_venv()
#  - node_version()
#  - exit_icon()
#  - __prompt_command()
#
#  Starship will now handle all of this.
# -----------------------------------------------------------

#### --- TERMINAL SETTINGS --- ####
export TERM=xterm-256color

#### --- 2. INITIALIZE STARSHIP --- ####
# This sets the PS1 (prompt) before ble.sh takes over
eval "$(starship init bash)"

#### --- 3. ATTACH BLE.SH (Must be at the very bottom) --- ####
[[ \${BLE_VERSION-} ]] && ble-attach
`,
          },
          {
            label: "Apply different built-in starship themes",
            cmd: "starship preset tokyonight -o ~/.config/starship.toml",
          },
        ],
      },
    ],
  },
];

// --- Components ---

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text);
      } else {
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

// --- Helper Component for Collapsible Code ---
const CodeBlock = ({ code }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Count lines to decide if we need to collapse
  const lineCount = code.trim().split("\n").length;
  const isLong = lineCount > 6; // Limit: 6 lines

  return (
    <div className="mt-1 relative group/block">
      {/* Container */}
      <div
        className={`
          bg-slate-950 rounded-lg border border-slate-800 relative overflow-hidden transition-all duration-300
          ${
            isExpanded || !isLong ? "max-h-full" : "max-h-32"
          } /* 32 = approx 6-7 lines */
        `}
      >
        {/* Copy Button (Fixed Top Right) */}
        <div className="absolute top-0 right-0 p-2 z-10 bg-slate-950/50 backdrop-blur opacity-0 group-hover/block:opacity-100 transition-opacity">
          <CopyButton text={code.trim()} />
        </div>

        {/* Decorative Line */}
        <div className="absolute top-0 left-0 w-0.5 h-full bg-amber-500/50"></div>

        {/* Code Content */}
        <pre className="p-4 text-xs font-mono text-amber-100/80 leading-relaxed overflow-x-auto whitespace-pre font-variant-ligatures-none">
          {code.trim()}
        </pre>

        {/* Fade Out Overlay (Only when collapsed) */}
        {!isExpanded && isLong && (
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-950 to-transparent"></div>
        )}
      </div>

      {/* Toggle Button (Only if long) */}
      {isLong && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center gap-2 py-1.5 mt-1 text-[10px] uppercase font-bold tracking-wider text-slate-500 hover:text-cyan-400 hover:bg-slate-900/50 rounded transition-colors"
        >
          {isExpanded ? (
            <>
              <ChevronUp size={12} /> Collapse Code
            </>
          ) : (
            <>
              <ChevronDown size={12} /> View Full Config ({lineCount} lines)
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default function ArchSetupHub() {
  const [activeLayer, setActiveLayer] = useState(SETUP_LAYERS[0].id);
  const [reinstallMode, setReinstallMode] = useState(false);
  const [completedItems, setCompletedItems] = useState({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Track which item is expanded
  const [expandedItem, setExpandedItem] = useState(null);

  useEffect(() => {
    const savedProgress = localStorage.getItem("arch_setup_progress");
    if (savedProgress) {
      setCompletedItems(JSON.parse(savedProgress));
    }
  }, []);

  const toggleItemComplete = (itemId) => {
    const newCompleted = {
      ...completedItems,
      [itemId]: !completedItems[itemId],
    };
    setCompletedItems(newCompleted);
    localStorage.setItem("arch_setup_progress", JSON.stringify(newCompleted));
  };

  const toggleExpand = (itemId) => {
    setExpandedItem(expandedItem === itemId ? null : itemId);
  };

  const resetProgress = () => {
    if (window.confirm("Are you sure you want to clear all progress?")) {
      setCompletedItems({});
      localStorage.removeItem("arch_setup_progress");
    }
  };

  const getActiveLayerData = () =>
    SETUP_LAYERS.find((l) => l.id === activeLayer);

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
      {/* Mobile Header: Added 'h-16' to ensure it matches the sidebar offset */}
      <div className="lg:hidden flex items-center justify-between px-4 h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 font-bold text-cyan-400">
          <Terminal size={20} />
          <span>gyro-uyt</span>
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
          fixed left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 ease-in-out flex flex-col
          
          /* FIX: Mobile positioning - Starts 16 units down (below header), ends at bottom */
          top-16 bottom-0
          
          /* Desktop positioning - Returns to normal layout flow */
          lg:static lg:top-auto lg:bottom-auto lg:translate-x-0
          
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        >
          {/* Logo (Hidden on mobile because it's in the top bar) */}
          <div className="p-6 border-b border-slate-800 hidden lg:flex items-center gap-2 font-bold text-xl text-cyan-400">
            <Terminal size={24} />
            <span>gyro-uyt</span>
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
              <div className="mt-4 bg-slate-800/50 rounded p-3 animate-in fade-in slide-in-from-top-1">
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
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-slate-950 relative p-6 lg:p-10">
          <header className="mb-10">
            <h1 className="text-4xl font-bold text-white mb-2">
              {getActiveLayerData().title}
            </h1>
            <p className="text-lg text-slate-400">
              {getActiveLayerData().description}
            </p>
          </header>

          <div className="space-y-4">
            {getActiveLayerData().items.map((item) => {
              const isCompleted = completedItems[item.id];
              const isExpanded = expandedItem === item.id;
              // Only expandable if there's detailed info to show
              const hasDetails = item.subCommands || item.keybinds || item.note;

              return (
                <div
                  key={item.id}
                  className={`
                      group relative overflow-hidden rounded-xl border transition-all duration-300
                      ${
                        isCompleted
                          ? "bg-slate-900/30 border-slate-800"
                          : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:shadow-xl hover:shadow-cyan-900/5"
                      }
                    `}
                >
                  {/* Header Row */}
                  <div
                    onClick={() =>
                      reinstallMode
                        ? toggleItemComplete(item.id)
                        : toggleExpand(item.id)
                    }
                    className={`p-5 flex flex-col sm:flex-row gap-4 ${
                      reinstallMode || hasDetails ? "cursor-pointer" : ""
                    }`}
                  >
                    <div className="flex-1 flex items-start gap-4">
                      {reinstallMode && (
                        <div
                          className={`mt-1 transition-colors ${
                            isCompleted ? "text-green-500" : "text-slate-600"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 size={24} />
                          ) : (
                            <Circle size={24} />
                          )}
                        </div>
                      )}

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 mb-1">
                            <h3
                              className={`font-bold text-lg ${
                                isCompleted
                                  ? "text-slate-500 line-through"
                                  : "text-white"
                              }`}
                            >
                              {item.name}
                            </h3>
                            <div className="flex gap-1 flex-wrap">
                              {item.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-0.5 text-xs font-medium rounded-full bg-cyan-900/40 text-cyan-300 border border-cyan-800/50"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Expand Icon */}
                          {hasDetails && !reinstallMode && (
                            <div className="text-slate-500 transition-transform duration-200">
                              {isExpanded ? (
                                <ChevronUp size={20} />
                              ) : (
                                <ChevronDown size={20} />
                              )}
                            </div>
                          )}
                        </div>

                        <p className="text-slate-400 text-sm">{item.desc}</p>
                      </div>
                    </div>

                    {/* Primary Command */}
                    {item.cmd && (
                      <div
                        className="w-full sm:w-auto min-w-[300px] shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
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

                  {/* EXPANDABLE CONTENT */}
                  {isExpanded && hasDetails && !reinstallMode && (
                    <div className="border-t border-slate-800 bg-slate-900/30 p-5 animate-in slide-in-from-top-2 duration-200">
                      {/* Notes */}
                      {item.note && (
                        <div className="mb-6 bg-amber-900/10 border border-amber-900/30 rounded-lg p-3 text-sm text-amber-200/80">
                          <span className="font-bold text-amber-500 block mb-1 text-xs uppercase tracking-wider">
                            Note
                          </span>
                          {item.note}
                        </div>
                      )}

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Sub Commands */}
                        {/* Sub Commands / Steps Section */}
                        {/* Sub Commands */}
                        {item.subCommands && (
                          <div className={item.keybinds ? "" : "col-span-2"}>
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                              <Command size={14} /> Installation Steps
                            </h4>
                            <div className="space-y-4">
                              {item.subCommands.map((sub, idx) => (
                                <div
                                  key={idx}
                                  className="flex flex-col gap-1.5"
                                >
                                  <span className="text-xs text-slate-400 ml-1 font-medium">
                                    {sub.label}
                                  </span>

                                  {/* LOGIC: Is this a Code Block or a Command? */}
                                  {sub.code ? (
                                    // USE THE NEW COMPONENT HERE
                                    <CodeBlock code={sub.code} />
                                  ) : (
                                    // RENDER SINGLE COMMAND
                                    <div className="flex items-center bg-slate-950 rounded border border-slate-800/60 overflow-hidden group/sub">
                                      <code className="flex-1 px-3 py-2 text-xs font-mono text-cyan-200/80 overflow-x-auto whitespace-nowrap scrollbar-hide">
                                        {sub.cmd}
                                      </code>
                                      <div className="border-l border-slate-800/60">
                                        <CopyButton text={sub.cmd} />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Keybinds */}
                        {item.keybinds && (
                          <div>
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                              <Keyboard size={14} /> Keybinds
                            </h4>
                            <div className="bg-slate-950 rounded border border-slate-800/60 overflow-hidden">
                              <table className="w-full text-xs text-left">
                                <tbody className="divide-y divide-slate-800">
                                  {item.keybinds.map((kb, idx) => (
                                    <tr
                                      key={idx}
                                      className="group/row hover:bg-slate-900/50"
                                    >
                                      <td className="p-2 font-mono text-cyan-400 whitespace-nowrap border-r border-slate-800/50 w-1">
                                        {kb.keys.map((k) => (
                                          <span
                                            key={k}
                                            className="inline-block bg-slate-800 px-1.5 py-0.5 rounded text-[10px] mx-0.5 border border-slate-700"
                                          >
                                            {k}
                                          </span>
                                        ))}
                                      </td>
                                      <td className="p-2 text-slate-400">
                                        {kb.action}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {getActiveLayerData().items.length === 0 && (
            <div className="text-center py-20 text-slate-500">
              <Settings size={48} className="mx-auto mb-4 opacity-50" />
              <p>No items configured for this layer yet.</p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-slate-900 flex justify-between items-center text-slate-600 text-sm">
            <span>{getActiveLayerData().id}</span>
            <span className="font-mono">Configured by You</span>
          </div>
        </main>
      </div>
    </div>
  );
}
