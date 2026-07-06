using System;

public class Dado
{
    public int Tirar()
    {
        Random random = new Random();
        return random.Next(1, 5);
    }
}
