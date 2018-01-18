using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sudoku.Models
{
    public class Settings
    {
        public bool DarkMode { get; set; }
        public Difficulty Difficulty { get; set; }
        public Game SavedGame { get; set; }
    }

    public enum Difficulty
    {
        Easy,
        Medium,
        Hard
    }
}
