# syntax=docker/dockerfile:1

# ---------- Build stage ----------
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copiar solo los .csproj primero para cachear la restauración
COPY Laberinto.Api/Laberinto.Api.csproj Laberinto.Api/
COPY Laberinto.Application/Laberinto.Application.csproj Laberinto.Application/
COPY Laberinto.Domain/Laberinto.Domain.csproj Laberinto.Domain/
COPY Laberinto.Infrastructure/Laberinto.Infrastructure.csproj Laberinto.Infrastructure/

RUN dotnet restore Laberinto.Api/Laberinto.Api.csproj

# Copiar el resto del código y publicar en Release
COPY Laberinto.Api/ Laberinto.Api/
COPY Laberinto.Application/ Laberinto.Application/
COPY Laberinto.Domain/ Laberinto.Domain/
COPY Laberinto.Infrastructure/ Laberinto.Infrastructure/

RUN dotnet publish Laberinto.Api/Laberinto.Api.csproj -c Release -o /app/publish --no-restore

# ---------- Final stage ----------
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Fijar el puerto HTTP dentro del container (launchSettings.json no aplica en Docker)
ENV ASPNETCORE_URLS=http://+:5291
EXPOSE 5291

ENTRYPOINT ["dotnet", "Laberinto.Api.dll"]
