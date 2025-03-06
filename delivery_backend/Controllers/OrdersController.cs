using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("[controller]")]
public class OrdersController : ControllerBase
{
    private readonly ApplicationContext _context;
    private readonly ILogger<OrdersController> _logger;

    public OrdersController(ApplicationContext context, ILogger<OrdersController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public ActionResult<IEnumerable<Order>> Get()
    {
        try
        {
            return _context.Orders.ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при получении списка заказов");
            return StatusCode(500, "Не удалось получить список заказов. Пожалуйста, попробуйте позже.");
        }
    }

    [HttpGet("{id}")]
    public ActionResult<Order> GetOrder(int id)
    {
        try
        {
            var order = _context.Orders.Find(id);

            if (order == null)
            {
                return NotFound();
            }

            return Ok(order);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Ошибка при получении заказа с ID {id}");
            return StatusCode(500, "Не удалось получить заказ. Пожалуйста, попробуйте позже.");
        }
    }

    [HttpPost]
    public IActionResult Post([FromBody] Order order)
    {
        if (order == null)
        {
            return BadRequest("Заказ не может быть пустым.");
        }

        try
        {
            _context.Orders.Add(order);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
        }
        catch (DbUpdateException ex)
        {
            _logger.LogError(ex, "Ошибка при создании заказа");
            return StatusCode(500, "Не удалось создать заказ. Пожалуйста, попробуйте позже.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Неизвестная ошибка при создании заказа");
            return StatusCode(500, "Произошла неизвестная ошибка. Пожалуйста, обратитесь к администратору.");
        }
    }

    [HttpPut("{id}")]
    public IActionResult Put(int id, [FromBody] Order order)
    {
        if (order == null || id != order.Id)
        {
            return BadRequest("Неверный запрос.");
        }

        try
        {
            if (!_context.Orders.Any(e => e.Id == id))
            {
                return NotFound();
            }

            _context.Entry(order).State = EntityState.Modified;
            _context.SaveChanges();

            return NoContent();
        }
        catch (DbUpdateConcurrencyException ex)
        {
            if (!_context.Orders.Any(e => e.Id == id))
            {
                return NotFound();
            }
            else
            {
                _logger.LogError(ex, $"Ошибка конкурентного обновления заказа с ID {id}");
                return StatusCode(500, "Ошибка при обновлении заказа. Пожалуйста, попробуйте позже.");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Неизвестная ошибка при обновлении заказа с ID {id}");
            return StatusCode(500, "Произошла неизвестная ошибка. Пожалуйста, обратитесь к администратору.");
        }
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        try
        {
            var order = _context.Orders.Find(id);
            if (order == null)
            {
                return NotFound();
            }

            _context.Orders.Remove(order);
            _context.SaveChanges();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Ошибка при удалении заказа с ID {id}");
            return StatusCode(500, "Не удалось удалить заказ. Пожалуйста, попробуйте позже.");
        }
    }
}