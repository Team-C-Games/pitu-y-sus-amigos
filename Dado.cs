namespace Laberinto.Domain
{
    public class Dado
    {
        private static readonly int[] CARAS = { 1, 2, 2, 3, 3, 4 };

        public int Tirar()
        {
            Random random = new Random();
            return CARAS[random.Next(CARAS.Length)];
        }
    }
}
