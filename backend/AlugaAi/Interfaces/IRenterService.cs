using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AlugaAi.DTOs.InputModels;
using AlugaAi.DTOs.ViewModels;

namespace AlugaAi.Interfaces
{
    public interface IRenterService
    {
        public RenterViewModel CreateRenter(CreateRenterInputModel request);   
    }
}