using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Sudoku.Models;

namespace Sudoku.Controllers
{
    public class SudokuController : Controller
    {
        int[] Integers = new int[9] { 1, 2, 3, 4, 5, 6, 7, 8, 9 };
        Random Rnd = new Random();
        Game Game;
        int Seed;
        List<int> UsedSeeds = new List<int>();

        public IActionResult Index()
        {
            Game = new Game()
            {
                Boxes = new List<Box>()
            };

            try
            {
                CreateBoxes();

                SetFirstThreeSquares();

                SetFirstColumn();

                var fillBoxes = Game.Boxes.Where(b => b.Answer == 0).ToList();

                var done = false;
                while (!done)
                {
                    Seed = Integers.Where(i => !UsedSeeds.Contains(i))
                        .OrderBy(i => Rnd.Next()).First();
                    PencilBoxes(fillBoxes);

                    if (fillBoxes.Any(b => b.Answer == 0))
                    {
                        fillBoxes.ForEach(b =>
                        {
                            b.Answer = 0;
                            b.Pencil = new List<int>();
                        });
                    }
                    else
                    {
                        done = true;
                    }
                }
            }
            catch
            {
                return RedirectToAction("Index");
            }

            

            SetClues("easy");

            return View(Game);
        }

        void CreateBoxes()
        {
            for (var row = 0; row < 9; row++)
            {
                for (var col = 0; col < 9; col++)
                {
                    var box = new Box
                    {
                        Row = row,
                        Column = col
                    };
                    Game.Boxes.Add(box);
                }
            }
        }

        void SetFirstThreeSquares()
        {
            for (var sq = 0; sq < 3; sq++)
            {
                var boxes = Game.Boxes.Where(b => b.Square == sq).ToList();
                PencilBoxes(boxes);
            }
        }

        void SetFirstColumn()
        {
            var boxes = Game.Boxes.Where(b => b.Column == 0 && b.Answer == 0).ToList();
            PencilBoxes(boxes);
        }

        List<Box> PencilBoxes(List<Box> boxes)
        {
            foreach (var box in boxes)
            {
                if (box.Answer == 0)
                {
                    //check row
                    var usedAnswers = Game.Boxes.Where(b => b.Row == box.Row && b.Answer > 0)
                        .Select(b => b.Answer).ToList();
                    //check column
                    usedAnswers.AddRange(Game.Boxes.Where(b => b.Column == box.Column && b.Answer > 0)
                        .Select(b => b.Answer).ToList());
                    //check square
                    usedAnswers.AddRange(Game.Boxes.Where(b => b.Square == box.Square && b.Answer > 0)
                        .Select(b => b.Answer).ToList());
                    box.Pencil = Integers.Where(i => !usedAnswers.Contains(i)).ToList();
                }
            }

            if (boxes.Any(b => b.Pencil.Count > 0))
            {
                boxes = AnswerBoxes(boxes);
            }

            return boxes;
        }

        List<Box> AnswerBoxes(List<Box> boxes)
        {
            boxes = boxes.OrderBy(b => b.Pencil.Count == 0)
                .ThenBy(b => b.Pencil.Count).ToList();

            var nextBox = boxes.First();
            if (UsedSeeds.Contains(Seed))
            {
                nextBox.Answer = nextBox.Pencil.OrderBy(p => Rnd.Next()).First();
            }
            else
            {
                nextBox.Answer = Seed;
                UsedSeeds.Add(Seed);
            }
            nextBox.Pencil = new List<int>();

            return PencilBoxes(boxes);
        }

        void SetClues(string difficulty)
        {
            var reveal = 40;
            switch (difficulty)
            {
                case "easy":
                    reveal = 40;
                    break;
                case "medium":
                    reveal = 30;
                    break;
                case "hard":
                    reveal = 20;
                    break;
            }

            foreach (Box box in Game.Boxes)
            {
                if (Rnd.Next(100) < reveal)
                {
                    box.Guess = box.Answer;
                }
            }
        }
    }
}