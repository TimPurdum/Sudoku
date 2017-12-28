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
        public IActionResult Index()
        {
            var game = new Game()
            {
                Boxes = new List<Box>()
            };
            var random = new Random();
            var integers = new int[9] { 1, 2, 3, 4, 5, 6, 7, 8, 9 };

            var colList = new List<int>();
            var squareList = new List<int>();
            var rowList = new List<int>();

            for (var row = 0; row < 9; row++)
            {
                for (var column = 0; column < 9; column++)
                {
                    var currentSquare = (column / 3) + ((row / 3) * 3);

                    if (!game.Boxes.Where(b => b.Row == row && b.Column == column).Any())
                    {
                        colList = new List<int>();
                        var squareBoxes = game.Boxes.Where(b => b.Square == currentSquare).ToList();
                        var secondSquareBoxes = new List<Box>();
                        var thirdSquareBoxes = new List<Box>();

                        if (currentSquare < 6)
                        {
                            secondSquareBoxes = game.Boxes.Where(b => b.Square == currentSquare + 3).ToList();
                            if (currentSquare < 3)
                            {
                                thirdSquareBoxes = game.Boxes.Where(b => b.Square == currentSquare + 6).ToList();
                            }
                        }

                        for (var i = 0; i < 9; i++)
                        {
                            if (i < row)
                            {
                                var oldBox = game.Boxes.Single(b => b.Row == i && b.Column == column);
                                colList.Add(oldBox.Answer);
                            }
                            else
                            {
                                if (i == row)
                                {
                                    var remaining = integers.Where(num => !colList.Contains(num))
                                        .OrderBy(a => squareBoxes.Where(b => b.Answer == a).Any())
                                        .ThenBy(a => secondSquareBoxes.Where(b => b.Answer == a).Any())
                                        .ThenBy(a => thirdSquareBoxes.Where(b => b.Answer == a).Any())
                                        .ThenBy(a => random.Next()).ToList();
                                    colList.AddRange(remaining);
                                }

                                var box = new Box
                                {
                                    Answer = colList[i],
                                    Row = i,
                                    Column = column
                                };
                                game.Boxes.Add(box);
                            }
                        }

                        squareBoxes = game.Boxes.Where(b => b.Square == currentSquare).ToList();
                        secondSquareBoxes = new List<Box>();
                        thirdSquareBoxes = new List<Box>();

                        if (currentSquare != 2 && currentSquare != 5 && currentSquare != 8)
                        {
                            secondSquareBoxes = game.Boxes.Where(b => b.Square == currentSquare + 1).ToList();
                            if (currentSquare == 0 || currentSquare == 3 || currentSquare == 6)
                            {
                                thirdSquareBoxes = game.Boxes.Where(b => b.Square == currentSquare + 2).ToList();
                            }
                        }

                        rowList = new List<int>();
                        for (var j = 0; j < 9; j++)
                        {
                            if (j <= column)
                            {
                                var oldBox = game.Boxes.Single(b => b.Row == row && b.Column == j);
                                rowList.Add(oldBox.Answer);
                            }
                            else
                            {
                                if (j == column + 1)
                                {
                                    var remaining = integers.Where(num => !rowList.Contains(num))
                                        .OrderBy(a => squareBoxes.Where(b => b.Answer == a).Any())
                                        .ThenBy(a => secondSquareBoxes.Where(b => b.Answer == a).Any())
                                        .ThenBy(a => thirdSquareBoxes.Where(b => b.Answer == a).Any())
                                        .ThenBy(a => random.Next()).ToList();
                                    rowList.AddRange(remaining);
                                }
                                var box = new Box
                                {
                                    Answer = rowList[j],
                                    Row = row,
                                    Column = j
                                };
                                game.Boxes.Add(box);
                            }
                        }
                    }
                }
            }

            return View(game);
        }
    }
}