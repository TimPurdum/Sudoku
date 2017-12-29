using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sudoku.Models
{
    public class Box
    {
        public int Row { get; set; }
        public int Column { get; set; }
        public int Answer { get; set; }
        public int Guess { get; set; }
        public List<int> Pencil { get; set; }
        public int Square { get {
                return (Column / 3) + ((Row / 3) * 3);
            }
        }
        public int Index { get {
                return (Column * 9) + Row;
            }
        }
    }
}
