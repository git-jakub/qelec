﻿namespace qelec.Models.DTOs
{
    public class ResetPasswordDto
    {   
        public string Token { get; set; }
        public string NewPassword { get; set; }
    }
}
