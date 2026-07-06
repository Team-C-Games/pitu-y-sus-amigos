using Xunit;

namespace Laberinto.Tests
{
    public class DadoTests
    {
        [Fact]
        public void Tirar_DeberiaDevolverUnValorEntre1Y4()
        {
            // Arrange
            var dado = new Dado();

            // Act
            int resultado = dado.Tirar();

            // Assert
            Assert.True(resultado >= 1 && resultado <= 4);
        }

        [Fact]
        public void Tirar_DeberiaAparecerCadaValorAlMenosUnaVezEn1000Tiradas()
        {
            // Arrange
            var dado = new Dado();
            int[] resultados = new int[1000];
            for (int i = 0; i < 1000; i++)
            {
                resultados[i] = dado.Tirar();
            }

            // Assert
            Assert.Contains(1, resultados);
            Assert.Contains(2, resultados);
            Assert.Contains(3, resultados);
            Assert.Contains(4, resultados);
        }
    }
}
